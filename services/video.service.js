import http from "../http-common";

//this file gives the screens some functions to use to call data from the server
class VideoDataService {
	getAll(data) {
		const queryParams = new URLSearchParams(data).toString();
		const url = `/videos?${queryParams}`;
		return http.get(url);
	}

	get(id) {
		return http.get(`/videos/${id}`);
	}

	create(data) {
		return http.post("/videos", data);
	}

	update(id, data) {
		return http.put(`/videos/${id}`, data);
	}

	delete(id) {
		return http.delete(`/videos/${id}`);
	}

	deleteAll() {
		return http.delete("/videos");
	}

	//test functions

	getVideo(id) {
		return http.get(`/videos/${id}`);
	}
    
	getTopicVids(topic, page, pageSize) {
		return http.get(`/videos/topics/${topic}`, {
			params: {
				page: page,
				pageSize: pageSize
			}
		});
	}

	delete(id) {
		return http.delete(`/videos/${id}`);
	}

}

export default new VideoDataService();