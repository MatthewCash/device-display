# device-display

A web frontend for [`device-controller`](https://github.com/MatthewCash/device-controller)

## Items Displayed

- On & Off Scene
- Binary Switch Devices
- Lighting Color (HSL, Temp)
- Lighting Brightness
- Lighting Effecs

## Configuration

`device-controller` requires authentication for all connections, an authentication token must be provided in URL search parameters

Provide the token by connecting with `http://localhost?devices-auth-token=TOKEN`

The WS url used when connecting can also be configured with the `devices-auth-token` search parameter

The binary switch device list can be limited to a certain class with the `device-filter-tag` search parameter