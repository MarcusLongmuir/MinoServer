echo "stantest" | heroku apps:destroy stantest
heroku create stantest
heroku addons:add mongolab
git push heroku master