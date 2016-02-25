# Review Analyzer
With this app you can analyze any text you want and forecast the rating.
For now i crawled about 22k comments to films from letterboxd.com.
The application analyzes the comments word by word and build a dictionary with the used words ordered by their ratings. I although built a Web-Interface where you can input any text and the AI shows you live the most likely rating.


### Example:
If user who uses "awesome" "great" etc. in their comments and rate the film with 5 the AI recognizes that. Now if you input text with "awesome" "great" etc. the AI calculates the occurrences of this words and give you the most likely rating to the text.

Input comments can look like this.
```
{"rating": "5", "movie_id": "128274", "text": "My personal favorite of the shorts shown for Experimental Week, but my professor looked at me like I was off my rocker when I said this was about American consumer culture; to me it couldn`t be about anything but consumer culture. The snow at the end (that`s another thing, he swears it`s ash) is a nice touch.", "movie_title": "Burn", "user": "Ethan Rosenberg", "time": 1444773600000, "review_url": "/s/full-text/viewing:10629993/", "id": "000545ec-408f-4445-93cc-b8481a4dd601"},


{"rating": "5", "movie_id": "160532", "text": "O filme conta com algumas cenas e situa\u00e7\u00f5es bem divertidas e vale por algumas risadas, pena que a correria de terminar a hist\u00f3ria junto como cruzeiro deixou o final da hist\u00f3ria muito corrido e bastante comprometido.", "movie_title": "Meu Passado me Condena", "user": "Marcio Melo", "time": 1385938800000, "review_url": "/s/full-text/viewing:3098646/", "id": "00086c2d-db2f-4f58-9d13-2f3ed76e530e"},


{"rating": "9", "movie_id": "175170", "text": "The Notorious Mr. Bout is documentary about the illicit arms dealer Viktor Bout. It`s an eye opening insight into the arms trade in general and asks many questions on post 9/11 practice by the USA. The film works due to the fact that Viktor Bout liked to film just about everything, giving the film makers plenty of footage to narrate the film, added with the usual talking head style interviews from the people closely involved.", "movie_title": "The Notorious Mr. Bout", "user": "sonofsam", "time": 1412114400000, "review_url": "/s/full-text/viewing:5870345/", "id": "0008da9f-7f01-49f5-8e1f-e3939c5e77d3"},


{"rating": "1", "movie_id": "181937", "text": "IT`S ARRRRRRRRTTT!!!!! *FARTS FOR A THOUSAND YEARS*", "movie_title": "Nymphomaniac: Vol. I", "user": "Kelly", "time": 1455137534000, "review_url": "/s/full-text/viewing:12610344/", "id": "000bf714-cb9c-4979-bf8d-822d2dee79e0"},
{"rating": "4", "movie_id": "216403", "text": "\"Naglalakad na kwento, `yan ang tao.\"", "movie_title": "One Night", "user": "Zim Dela Pe\u00f1a", "time": 1158012000000, "review_url": "/s/full-text/viewing:6714035/", "id": "000df76c-bde6-4759-8b91-a233248b38ee"}

etc...
```
My Node Module mLearning lears every comment with:
```
ai.learn("Here comes the comment text", review.rating);
```
You can analyze a comment by doing this:
```
var rating = ai.analyze("Text to be analyzed");
```
Now you can output the Variable "rating" and you get the rating which is calculated by the AI.

If you have started the Node Server you can go to [localhost:1337](https://localhost:1337) and input any Text you want. The AI calculates the most likely rating to the given text.