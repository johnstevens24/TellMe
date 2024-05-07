import http from "../http-common";

//this file gives the screens some functions to use to call data from the server
class VoteDataService {
	getAll() {
		return http.get("/votes");
	}

	get(id) {
		return http.get(`/votes/${id}`);
	}

    getByVidId(id) {
		return http.get(`/votes/vid/${id}`);
	}

	create(data) {
		return http.post("/votes", data);
	}

	getVoteResults(vid_id) {
		return http.get(`/votes/results/${vid_id}`);
	}

	getHasVoted(video_id, user_id) {
		return http.get(`/votes/has_voted/${video_id}/${user_id}`);
	}

	getVotedVids(user_id) {
		return http.get(`/votes/votesByUser/${user_id}`);
	}

}

export default new VoteDataService();