Annotation
==========

couchdb adapter for [east](https://github.com/okv/east) migration tool

How to use
==========

Provide couchdb access via environment variables:
`COUCHDB_USER, COUCHDB_PASSWORD, COUCHDB_HOST, COUCHDB_PORT`
or
`COUCHDB_URL`

or in `.eastrc`:
```json
{
    "couchdb": {
        "username": "<username>",
        "password": "<password>",
        "host": "<host>",
        "port": "<port>"
    }
}
```
or
```json
{
    "couchdb": {
        "url": "http://my.couchdb.server"
    }
}
```

`host` is required; `username`, `password`, `port` are optional.

Other options see in `east` docs.
