const db = require("../models");
const Vote = db.votes;
const FollowUp = db.followups;
const Video = db.videos;

exports.calculateUserChosenVideoProportion = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find all the option ids that the user has voted on
        const votes = await Vote.findAll({
            where: {
                user_id: userId
            },
            attributes: ["option_id"]
        });

        // Extract option_ids from the votes
        const votedOptionIds = votes.map(vote => vote.option_id);

        // Find all the follow ups where the chosen_id matches any of the voted option ids
        const chosenFollowUps = await FollowUp.findAll({
            where: {
                chosen_id: {
                    [db.Sequelize.Op.in]: votedOptionIds
                }
            }
        });

        const totalVotedOptions = votedOptionIds.length;
        const totalChosenVideos = chosenFollowUps.length;

        // Calculate the proportion
        const proportion = totalVotedOptions > 0 ? totalChosenVideos / totalVotedOptions : 0;

        res.json({ userId, proportion });
    } catch (error) {
        console.error("Error calculating user chosen video proportion:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.countUserVotesOnTheirVideos = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Subquery to get the video ids of the user's videos
        const userVideoIds = await Video.findAll({
            attributes: [[db.Sequelize.literal('id'), 'vid_id']],
            where: { user_id: userId }
        });

        // Extract video ids from the result of the subquery
        const videoIds = userVideoIds.map(video => video.dataValues.vid_id);

        // Count the number of votes for the user's videos
        const voteCount = await Vote.count({
            where: { video_id: videoIds }
        });

        res.json({ userId, voteCount });
    } catch (error) {
        console.error("Error counting user votes on their videos:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.countUserVotesOnOtherVideos = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Count the number of votes made by the user
        const voteCount = await Vote.count({
            where: { user_id: userId }
        });

        res.json({ userId, voteCount });
    } catch (error) {
        console.error("Error counting user votes on other videos:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.findMostVotedTopicByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await Vote.findAll({
            attributes: [
                [db.sequelize.literal(`COALESCE(NULLIF(\`video\`.\`topic\`, 'none'), 'Other')`), 'chosen_topic'],
                [db.sequelize.fn('COUNT', '*'), 'vote_count']
            ],
            include: [
                {
                    model: Video,
                    as: 'video', // Specify the alias for the association
                    attributes: [],
                    where: {
                        topic: { [db.Sequelize.Op.not]: null, [db.Sequelize.Op.ne]: 'none' }
                    }
                }
            ],
            where: { user_id: userId },
            group: ['chosen_topic'],
            order: [[db.sequelize.literal('vote_count'), 'DESC']],
            limit: 1,
            raw: true
        });

        res.json(result[0]);
    } catch (error) {
        console.error("Error finding most voted topic by user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.findMostPopularTopic = async (req, res) => {
    try {
        const result = await Video.findAll({
            attributes: [
                [db.sequelize.fn('COUNT', '*'), 'topic_count'],
                'topic'
            ],
            where: {
                topic: { [db.Sequelize.Op.not]: null, [db.Sequelize.Op.ne]: 'none' }
            },
            group: ['topic'],
            order: [[db.sequelize.literal('topic_count'), 'DESC']],
            limit: 1,
            raw: true
        });

        let mostPopularTopic = result[0];

        if (!mostPopularTopic) {
            // If no topic found, choose the first non-null and non-'none' topic
            const fallbackTopic = await Video.findOne({
                attributes: ['topic'],
                where: {
                    topic: { [db.Sequelize.Op.not]: null, [db.Sequelize.Op.ne]: 'none' }
                },
                raw: true
            });

            mostPopularTopic = fallbackTopic || null;
        }

        res.json(mostPopularTopic);
    } catch (error) {
        console.error("Error finding most popular topic:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.findUserRankingByVotes = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Execute the SQL query to find user's ranking based on vote count
        const userRanking = await db.sequelize.query(
            `
            SELECT
                u.id,
                u.username,
                COUNT(v.video_id) AS vote_count
            FROM
                users u
            LEFT JOIN
                votes v ON u.id = v.user_id
            GROUP BY
                u.id,
                u.username
            ORDER BY
                vote_count DESC;
            `,
            {
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        // Find the user's ranking from the result
        const user = userRanking.find(user => user.id === parseInt(userId));
        const userRank = userRanking.indexOf(user) + 1;

        res.json({
            userId: user.id,
            username: user.username,
            voteCount: user.vote_count,
            ranking: userRank
        });
    } catch (error) {
        console.error("Error finding user ranking by votes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};