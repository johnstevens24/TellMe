import http from "../http-common";

//this file gives the screens some functions to use to call data from the server
class FollowUpDataService {
	getAll() {
		return http.get("/followups");
	}

	get(id) {
		return http.get(`/followups/${id}`);
	}

	create(data) {
		return http.post("/followups", data);
	}

	update(id, data) {
		return http.put(`/followups/${id}`, data);
	}

	delete(id) {
		return http.delete(`/followups/${id}`);
	}

	deleteAll() {
		return http.delete("/followups");
	}

	//test functions

	getVideo(id) {
		return http.get(`/followups/${id}`);
	}

	getUsersFollowUps(userId) {
		return http.get(`/followups/getUsersFollowUps/${userId}`);
	}
    
    getVotedFollowups(userId) {
		return http.get(`/followups/getVotedFollowups/${userId}`);
	}

	getByVideoId(videoId) {
		return http.get(`/followups/findByVideo/${videoId}`);
	}
}

export default new FollowUpDataService();