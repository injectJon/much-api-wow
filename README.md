# Welcome to the SmartIr API

This API serves SmartIr devices as well as frontend clients wishing to utilize the stored sensor data.

### Fetching readings

You can get readings from the API by visiting the following endpoint:
https://much-api-wow.herokuapp.com/readings

Be careful, this enpdoint will return all of the readings stored in the database. You will have a bad time if you try and use this in your frontend client.

If you'd like to limit the quantity of readings returned, and you should, use this query in the url:

```
/readings?quantity=10
```

Change the quantity to any number that fits your needs.

### Here is an example request using node-fetch:

```js
const url = "https://much-api-wow.herokuapp.com/readings?quantity=1";
fetch(url)
  .then(res => res.json())
  .then(body => console.log(body));
```

And here is the typical output from the above request:

```json
{
  "success": true,
  "statusCode": 200,
  "statusMessage": "OK",
  "data": [
    {
      "_id": "5c8420024807ab12ec47449c",
      "date": 1552162818526,
      "moisture": 989,
      "light": 658,
      "temp": 68,
      "__v": 0
    }
  ]
}
```

As you can see, the readings are returned in an array within the `data` field.
