# Snoozz Stats

This is a tiny repo with code used to build the web app at stats.snoozz.me.
It basically is the API with which I collect anonymous click data for my extension [Snoozz](https://github.com/rohanb10/snoozz-tab-snoozing).

All the data that passes through this API is publicly available on the [Stats page](https://snoozz.me/stats.html) of the Snoozz website.

Theres nothing fancy here. I followed this tutorial for the most part. Its slightly outdated but there's still a good chunk of useful information.
https://www.sitepoint.com/deploy-rest-api-in-30-mins-mlab-heroku/

The data is sent to a MongoDB collection, and this code is running on Heroku.

#### Dont read the section below. Its top secret and not for you.

Sub in the Mongo Connection URL and run `npm start` to test locally

Deploy on Heroku `git push heroku main`

Heroku logs `heroku logs --tail`
