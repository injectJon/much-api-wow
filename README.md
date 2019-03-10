# Welcome to the SmartIr API

This API serves SmartIr devices as well as frontend clients wishing to utilize the stored sensor data.

## Fetching readings

You can get readings from the API by visiting the following endpoint:
https://much-api-wow.herokuapp.com/readings

Be careful, this enpdoint will return all of the readings stored in the database. You will have a bad time if you try and use this in your frontend client.

If you'd like to limit the quantity of readings returned, and you should, use this query in the url:

```
/readings?quantity=10
```

Change the quantity to any number that fits your needs.

### Here is an example request using node-fetch

```js
const url = "https://much-api-wow.herokuapp.com/readings?quantity=1";
fetch(url)
  .then(res => res.json())
  .then(body => console.log(body));
```

And here is a typical response to the above query:

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

## Store readings from SmartIr device

### Authorization

In order to send data from your device to the API, you need to be authorized.

```cpp
String postRequest =
    "POST " + uri + " HTTP/1.0\r\n" +
    "Host: " + server + "\r\n" +
    "Accept: *" + "/" + "*\r\n" +
    "Content-Length: " + data.length() + "\r\n" +
    "Content-Type: application/x-www-form-urlencoded\r\n" +
    "Authorization: Bearer <API KEY HERE>" +
    "\r\n" +
    data;
```

Notice the `Authorization` header. You need to have this authorization header in your HTTP post request. In it, you need the API Key. Contact me for an API key.

### URL and Query Parameters

The URL needs to look like the following example:

```
https://much-api-wow.herokuapp.com/readings?deviceID=123abc456def&moisture=900&light=658&temp=67
```

Notice those query parameters `?deviceID=123abc456def&moisture=900&light=658&temp=67`

We have `deviceID`, `moisture`, `light`, and `temp`.

- `deviceID` is a string representing your device's MAC address
- `moisture` is a number representing your moisture sensor reading
- `light` is a number representing your light sensor reading
- `temp` is a number representing your temperature sensor reading

All of these parameters are required if you want to store the reading in the database.
