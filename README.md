# Ripelib
Ripe lib functions and scripts.

Let's you find the location from an IP address.

### Install

```
npm i ripelib
```

### Usage

```
var ripe = require('ripelib')

// Get ip to location
var ip = '194.23.4.1'
var location = ripe.ip2location(ip)

{
  ip: '194.23.4.1'
  country: 'Norway',
  city: 'Oslo'
}
```

Created by [Eldøy Projects](https://eldoy.com)

Enjoy!
