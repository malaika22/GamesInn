import { bearerAuth, OpenApi } from "ts-openapi";


abstract class OpenAPIConfiguration {

    public static openAPIInstance: OpenApi;

    public static ConfigOpenAPI() {
        OpenAPIConfiguration.openAPIInstance = new OpenApi("v1.0", // API version
            "Gamesinn APIS ", // API title
            "All apis are explained here.", // API description
            "taimoormuhammad954@gmail.com" // API maintainer
        )

        this.openAPIInstance.setServers([{ url: 'http://localhost:8000' }])

        this.openAPIInstance.setLicense(
            "Apache License, Version 2.0", // API license name
            "http://www.apache.org/licenses/LICENSE-2.0", // API license url
            "http://dummy.io/terms/" // API terms of service
        );

        return this.openAPIInstance
    }

}