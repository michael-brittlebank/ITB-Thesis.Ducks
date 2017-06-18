class RequestService {
    static getSessionHeaders(store){
        let sessionToken = this.getSessionToken(store);
        return {
            'Authorization': 'Bearer ' + sessionToken
        };
    }

    static getSessionToken(store){
        let currentState = store.getState();
        return currentState.userState.sessionToken;
    }

    static getApiUrl(store){
        let currentState = store.getState();
        return currentState.configState.apiUrl;
    }

}

export default RequestService;