# Backend Developer Coding Challenge: A Solution

This repo is a solution for the [Feeld Backend Developer Coding Challenge](https://github.com/Feeld/backend-developer-test), to see how I think, code and structure my work.

The original file in which the problem is defined [is around here](PROBLEM.md). This readme has a bit of a personal touch to it. I do not usually write documentation like this, but in this readme you'll find insights on my decisions, personal opinions, and possibly even jokes... I'm just in the 3rd line of this, how would I know.

**NOTICE**: About those API keys I have published here. There are my own and will be deleted once this challenge is reviewed and no longer has to work. 
**NOTICE 2**: Facebook authentication **will not work** if you don't deploy the service with HTTPS.

## Solution explanation
The solution started around building the bare minimum to match the original requirements. However, a few choices were made taking into account building extra things on the application in the future. A clear example of this was choosing Typescript or the initial directory structure.

The solution consists in a web application with a minimal front-end that provides access to social authentication methods as well as the API documentation. Authenticating with Google or Facebook would get the user a Bearer token that can be used to query the methods explained on the documentation.

The proposed solution includes a lot of things not specified in the minimum requirements, and it became to be just a sandbox in which to integrate new things and learn about new technologies.

## Installation and usage
This project depends on a empty mongo database connection. It will create a few collections on the specified database. You can deploy your own mongo or use the public one I've created: `mongodb://ndrs:abc123..@ds127624.mlab.com:27624/ndrs`

For any building and deploying environment variables will be needed. These are the environment variables supported (and most of them needed):
* **PORT**: The application port. Defaults to `3000`
* **MONGODATABASE**: The mongo database connection string. Defaults to `mongodb://ndrs:abc123..@ds127624.mlab.com:27624/ndrs`
* **SERVER_HOST_AND_PORT**: The server host and port string. Defaults to `localhost:3000`
* **GOOGLE_API_KEY**: The Google API key. Defaults to `754430402565-v30n74gtrs1tedro6e8snhg3tvi5v727.apps.googleusercontent.com`
* **GOOGLE_API_SECRET**: The Google API key. Defaults to `iKl-LJg4c3yUxT3KgWTyal6e`
* **FACEBOOK_API_KEY**: The Facebook API key. Defaults to `267125553982106`
* **FACEBOOK_API_SECRET**: The Facebook API key. Defaults to `2badf21d0e2cf282015f53de4cb7d8c8`

These 3 methods of using the application are ordered from easier to harder.

### Accessing to a public deployment
Okay, I know this **is not installing** but the easiest way to take a peak at the back-end is just going to [my deployment on my server](http://ndrs.es:3000/). 

Take in mind that using this you won't be able to authenticate with Facebook, as the server right now does not have https support.

### Deploy a docker container
Deploying a docker container is as cloning the repository and running it. However, take in mind you'll have to pass it a few environment variables with your configuration.

The following commands are an example on how to run the docker image. Remember to add more `-e KEY="value"` pairs to the command with your keys.

```
$ cd backend-developer-test
$ docker build -t ndrs/feeld-backend-test .
$ docker run --name <just-a-name> -d -p 3000:3000 -e SERVER_HOST_AND_PORT="http://<myhost>:3000" ndrs/feeld-backend-test
```

### Manual installation
Once you clone the repository follow this steps
* Go to the cloned project folder
* Ensure you have `npm` and `node` installed (preferred version: 10)
* Execute `npm install`
* Execute `KEY=VALUE npm start`

Remember to include all the `KEY=VALUE` pairs for environment variables needed to suit your needs. You can also change `src/config/Configuration.ts` before doing anything to tweak some things.

## Technologies and functionality
As the original problem states, the Feeld team expects extra functionalities. I've taken advantage on this to consolidate technologies I've already worked with and at the same time to learn some new ones. So I took a bunch of ideas from *the great Internet* and put them all together.

I'm assuming you know these technologies/packages to reduce bloat on this readme file. Also, yo *do* know I would paste the first line of the respective Wikipedia page... So whatever.

### Typescript
This was an arguable decision. The job position clearly states that Feeld needs a JavaScript lover. Is not this exactly the opposite? Depends on the opinion. From my point of view, Typescript is an easy to adapt superset and introduces no changes if the programmer decides to use Javascript while making other things in Typescript. For this reason, I wanted to implement this solution using it.

Why use it? The big things for me are:
* Structure: Easier to write large projects. This means the programmer has to *want* to use structure, but at least the language provides a cool one.
* Type completion: Let's make this clear. I'm not a `DON'T EVER USE the word any` hooligan. I just think vscode letting me know what methods/props I have in a symbol is neat. This is oversimplifying, but the underlaying reality is that I just really like to have that possibility. Also, writing more words on the code makes you feel cooler.
* JS Interoperability: This just doesn't break anything if you start to use it in a project. JS works fine and sometimes, it is more appropriate to use it.

### Mongoose and Typegoose
There's not a lot to say here. I just think having an abstraction layer over the database connection is a good idea. In the past I used mongo in the most bare form and I was forced to implement a bit of an architecture (like singleton and joi validations everywhere), realizing I just had reimplemented mongoose... (That was for learning purposes, I should note).

As for Typegoose, I just wanted to simplify Mongoose schemas taking advantage of my decision of using typescript. Typegoose is really clean on model definition, but has some hiccups and strange things in which as writing code and types refer. 

### Express routing, controllers and middleware approach
I've used express because of the sheer amount of documentation and help that there is on the Internet. I followed a `Base route -> Middleware -> Specific Route -> Middleware -> Request Controller` general structure with some exceptions that make the code easier to read, easier to write, structured an semantically comprehensive.

I've used the controllers with separated static methods because I think nesting arrow functions like you see in a lot of projects to handle routes is just harmful for a team in the long term. Also, it does not introduce a lot of code and, under just a programmer point of view, feels just like a bit of *syntactic sugar*.

### OAuth authentication with Grant
Yup. I didn't use passport. Am I mad? Probably. Grant just does the job simply. I decided on using this package as I actually didn't ever work with OAuth and I've searched for the simplest solution. I found this and once I worked a bit with it I really like and understand its capabilities and how it is simpler (but at the same time mostly the same) than passport.

### Default geolocation
I've used a geolocation API to get the current location in which you're now, based on public IP. It's simple and just fills a bit of data. However, this makes the application put me searching board game matches 500km away. 

I just thought that Google would have some permission to let you check the last Google Maps location if you have Timeline enabled, however I couldn't find it.

### Web interface
I've put a little landing page with social authentication and API documentation links. I think it's a neat touch and really easy to implement. Also I like it better than just writing the endpoints on the URL. Nothing fancy, just using `handlebars-express` to render a layout with a view. The rest is just good ol' HTML/CSS/JS.

### Documentation with Swagger
I've seen swagger being used on my current job but I didn't have the opportunity to check it out for myself. I really like the code generation tools and how robust it feels. However I wanted to implement this backend first and then document it, as I wanted to put my personal touch on it, so I've just used swagger to document.

I a bit of a hassle to write the swagger.json file but it turns out really good.

### Winston file & console logging
I implemented a singleton `Log` class with Winston logging. By default it is logging to the console and to a (configurable) file on disk. Having logs on this kind of application to identify weird behaviour and errors is really important. However as you can see in the code, not a lot of logging is made, as I just didn't have a lot of time and didn't seem sensible to prioritize this.

### Docker deployment and microservice approach
Once I had read the proposed problem to solve I quickly thought about having docker containers for different services. If we take this to the extreme, a project like this could be composed of different microservices, separating routing and data validation business logic from database access and management. However due to the nature of this kind of application I think that's a bit of overengineering.

However, once thing that was clear to me was making this project easily deployed with docker. I wanted to do a compose with a `node` image and a `mongo` one but mongo v4.0.4 just gave me a lot of headache with ip binding, I got frustrated, and forgot about dockerizing mongo, so I created a free mongo database online in mLab. At this point, a compose is useless (only one image).

## Flaws and future improvements
Let's be realistic here. This project is not nearly ready for production use. Even not for testing. There are a few validations and a lot of hopes on try/catch blocks. I'll try to structure flaws and improvements on a list form like `P: problem ; I: improvement`:
* P: Lacks a lot of validation; I: Incorporate `joi` schemas to validate request bodies and messages. Implement validation controllers for cohesive data
* P: Lacks logs; I: Write a bit of code on the Log class to support errors, put mail/slack/discord loggers and just write a ton of log logic on validations.
* P: Lacks tests; I: Incorporate test framework. I didn't do it because I ran out of time and TDD felt slower and I was afraid of not having enough time or doing it bad and giving a bad image
* P: Lacks error handling; I: Just try to put a wrong mongo URI (~~please don't~~)... So this means having error checking and meaningful logs to help the devops team to solve it.
* P: API docs are not helpful; I: Writing swagger takes time. So I did an "okay enough" job on it. Needs improvement
* P: API methods are RESTful (well... xml is missing), but a pain to use for a lot of things. I: Just make endpoints that are more easy to use.
* P: Some operations are not efficient. I: Just take a look at `/gameMatches/near/:maxDistance` (~~please don't~~). There's better ways to do that but I just think it is more useful to just implement something and realizing it is bad, to write it here, than not having time to submit anything at all.

## Self reflection on developing the solution

There's a lot of problems here and there. I just wanted to point out that there's no way this could be good being a time limited test (and me having a full time job). But I think what you guys are really searching for is for a developer that knows what to prioritize and to give solutions to problems, even if that implies to just write how would I solve it instead of doing it.

I think I offered an *okay* test solution. I personally don't think this is the best I can do. I spent my first weekend with friends and "lost" time to do this better, but that's just my personality, I really value my own time and realize me being happy means good work dynamics and proactive behaviour. So, sometimes, I just don't try to fix these things.

I can work at my 150% during a week, yes. But I think doing that for a test like this results only on cheating on you, guys, as I don't usually work like that. I'm not that 10x, rockstar developer every one seems to pretend to be.

So that's my reflection on this being a job opportunity. Of course, thank you all of you that are reading this. This is a really big opportunity for me and I just can't imagine myself working with a team like you. I have a bit of an insight on what I'm testing myself for, as a good friend of mine already works with you, and I'm sure I would be happy working at Feeld.

About the technical reflection... I learned a lot of things. As I previously said, I didn't work with OAuth, for example. I didn't work with Swagger or API documentation generators whatsoever. As I said to Dario in the interview, I have a job in which I can decide what to use and propose it, but client requirements are what they are, and usually I don't have the opportunity to just develop myself longer.

For my free time... I usually spend it on videogames. Don't get me wrong! I usually spend it **developing** videogames. So I'm familiar and I like these stacks of technologies but due to my current job I'm not as excited as I was while studying to learn new work-related things on my free time. This is just how it is for me.


So, as a final note: This README has a bit of the other part of what you search for: A person. In the source you'll have an insight to how my developer self works, and here, specially in this last section, the person I am. Thank you so much for the opportunity, and I had a good time learning these new things. 

*Andrés Vieira*