export const Config = {
    port: 3000,
    mongodbDatabase: "mongodb://localhost:27017/feeld-test",
    sessionConfig: {
        secret: "N2ZhZjlhNTY",
        resave: true,
        saveUninitialized: true
    },
    geoLocationAPIUrl: "http://ip-api.com/json/",
    googleUserInfoUrl: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    grant: {
        server: {
            protocol: "http",
            host: "localhost:3000"
        },
        google: {
            key: "754430402565-v30n74gtrs1tedro6e8snhg3tvi5v727.apps.googleusercontent.com",
            secret: "iKl-LJg4c3yUxT3KgWTyal6e",
            callback: "/google_callback",
            scope: [
                "profile",
                "email",
                "https://www.googleapis.com/auth/userinfo.profile"
            ]
        }
    }
}