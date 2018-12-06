export const Config = {
    port: process.env.PORT || 3000,
    mongodbDatabase: process.env.MONGODATABASE || "mongodb://ndrs:abc123..@ds127624.mlab.com:27624/ndrs",
    seedDataIfDBEmpty: true,
    logfile: "application.log",
    logDir: "./",
    sessionConfig: {
        secret: "N2ZhZjlhNTY",
        resave: true,
        saveUninitialized: true
    },
    geoLocationAPIUrl: "http://ip-api.com/json/",
    googleUserInfoUrl: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    facebokUserInfoUrl: "https://graph.facebook.com/v3.2/me?fields=email,name",
    grant: {
        server: {
            protocol: "http",
            host: process.env.SERVER_HOST_AND_PORT || "localhost:3000"
        },
        google: {
            key: process.env.GOOGLE_API_KEY || "754430402565-v30n74gtrs1tedro6e8snhg3tvi5v727.apps.googleusercontent.com",
            secret: process.env.GOOGLE_API_SECRET || "iKl-LJg4c3yUxT3KgWTyal6e",
            callback: "/google_callback",
            scope: [
                "profile",
                "email",
                "https://www.googleapis.com/auth/userinfo.profile"
            ]
        },
        facebook: {
            key: process.env.FACEBOOK_API_KEY || "267125553982106",
            secret: process.env.FACEBOOK_API_SECRET || "2badf21d0e2cf282015f53de4cb7d8c8",
            callback: "/facebook_callback",
            scope: [
                "email"
            ]
        }
    }
}