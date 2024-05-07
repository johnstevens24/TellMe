import http from "../http-common";

//this file gives the screens some functions to use to call data from the server
class OptionDataService {
	getAll() {
		return http.get("/options");
	}

	get(id) {
		return http.get(`/options/${id}`);
	}

    getByVidId(id) {
		return http.get(`/options/vid/${id}`);
	}

	create(data) {
		return http.post("/options", data);
	}

	upvote(option_id) {
		return http.post(`/options/upvote/${option_id}`)
	}

	downvote(option_id) {
		return http.post(`/options/downvote/${option_id}`)
	}

	undoUpvote(option_id) {
		return http.post(`/options/undoUpvote/${option_id}`)
	}

	undoDownvote(option_id) {
		return http.post(`/options/undoDownvote/${option_id}`)
	}

}

export default new OptionDataService();