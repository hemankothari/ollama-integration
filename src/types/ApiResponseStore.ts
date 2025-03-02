export class ApiResponseStore {
    private responses: Record<string, any> = {};

    saveResponse(url: string, data: any) {
        this.responses[url] = data;
    }

    getResponses() {
        return this.responses;
    }

    // Get response for a specific URL
    getResponse(url: string) {
        return this.responses[url] || null;
    }

    // Clear stored responses
    clearResponses() {
        this.responses = {};
    }
}

export const apiResponseStore = new ApiResponseStore(); 