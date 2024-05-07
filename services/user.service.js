import http from "../http-common";

//this file gives the screens some functions to use to call data from the server
class UserDataService {
	getAll() {
		return http.get("/users");
	}

	get(id) {
		return http.get(`/users/${id}`);
	}

	create(data) {
		return http.post("/users", data);
	}

	update(id, data) {
		return http.put(`/users/${id}`, data);
	}

	delete(id) {
		return http.delete(`/users/${id}`);
	}

	deleteAll() {
		return http.delete("/users");
	}

	getVideo(id) {
		return http.get(`/videos/${id}`);
	}

	getPostCount(id) {
		return http.get(`/users/postCount/${id}`);
	}

	login(username, password){
		return http.post("/users/login", {username, password});
	}

	getUserVideos(id) {
		return http.get(`/videos/getUsersVideos/${id}`);
	}

	updateEmail(id, newEmail) {
		return http.put(`/users/updateEmail/${id}`, { newEmail });
	}

	updatePassword(id, currentPassword, newPassword) {
		return http.put(`/users/updatePassword/${id}`, { currentPassword, newPassword });
	}

	updateProfilePicture(id, newProfilePic) {
		return http.put(`/users/updateProfilePicture/${id}`, { newProfilePic });
	}

	updateUsername(id, newUsername) {
		return http.put(`/users/updateUsername/${id}`, { newUsername });
	}
}	

export default new UserDataService();