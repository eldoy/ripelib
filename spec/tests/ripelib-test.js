it('should return country', async ({ t, $ }) => {
  var ip = '182.50.176.0'
  var result = $.ripe.ip2location(ip)
  t.deepStrictEqual(result, { ip, country: 'Norway' })

  ip = '213.30.5.9'
  result = $.ripe.ip2location(ip)
  t.deepStrictEqual(result, { ip, country: 'Portugal' })

  ip = '88.98.105.230'
  result = $.ripe.ip2location(ip)
  t.deepStrictEqual(result, { ip, country: 'Spain' })

  ip = '2003:ea:d728:3a90:2943:df69:1f9c:e31d'
  result = $.ripe.ip2location(ip)
  t.deepStrictEqual(result, { ip, country: 'Germany' })

  ip = '12.161.61.162'
  result = $.ripe.ip2location(ip)
  t.deepStrictEqual(result, { ip, country: 'United States of America' })

  ip = '103.116.13.229'
  result = $.ripe.ip2location(ip)
  t.deepStrictEqual(result, { ip, country: 'Indonesia' })

  ip = '45.124.58.4'
  result = $.ripe.ip2location(ip)
  t.deepStrictEqual(result, { ip, country: 'Philippines' })

  ip = '180.244.129.164'
  result = $.ripe.ip2location(ip)
  t.deepStrictEqual(result, { ip, country: 'Indonesia' })
})
