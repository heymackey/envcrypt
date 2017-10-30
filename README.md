# envcrypt
Coming soon ...

## cli

The idea with this re-do is to make it more similar to the Rails way to reduce friction when interacting with this package. The issue with the current model is that all arguments need to be passed via cli, and it becomes cumbersome to manage more than a few, and also allowing for plain-text + encrypted per environment might allow someone to accidentally commit a secret value in clear text.

Rails' encrypted secrets works like this:

```sh
# setup secrets files
$ bin/rails secrets:setup

# add/edit/delete within yaml file in your $EDITOR, encrypts on save
$ bin/rails secrets:edit

# view secrets, since file is a big block of random numbers
$ bin/rails runner "puts Rails::Secrets.read" 
```

The new cli interaction of `envcrypt` could be one that's more Rails-like.

```sh
$ envcrypt setup
# generates secrets.json and config.json files for you (and possibly a key?)

$ ENVCRYPT_KEY=(key) envcrypt edit
# opens up $EDITOR to edit JSON file in plaintext, encrypts each value on save

$ ENVCRYPT_KEY=(key) envcrypt read
# displays keys with decrypted values
```

When it's time to run the tests, or spin up the server, you'll likely need access to those encrypted values. You can use the envcrypt as a pre-command before your test or server scripts, like below.

**package.json**
```json
{
  "name": "my-awesome-envcrypted-application",
  ...
  "scripts": {
    "start": "envcrypt node dist/server.js",
    "test": "envcrypt --config test jest",
    ...
  },
  ...
}
```

**in your shell**
```sh
# run the tests
ENVCRYPT_KEY=(key) npm test

# in orderto pass arguments to envcrypt, add them after a --
$ ENVCRYPT_KEY=(key) npm start -- -c production
```

## storage

`envcrypt` splits the configuration between two files; a plain-text one for basic values (like URLs and ports), and an encrypted one for sensitive information (api keys, application ids/secrets, etc). This pattern follows _the Rails' way™_, much like `secrets.yml` / `secrets.yml.enc`. 

When you run `envcrypt setup`, these two files (`config.json` and `secrets.json`) will be generated for you. You can edit and manage `config.json` using any editor, but for `secrets.json`, you'll need to use `encrypt edit` to change the values. Below is an example of the resulting output of the encryption in the `secrets.json` file. 

```json
{
  "production": {
    "FOO": "asfasf123r123e4qdfwfqwfqr12r12r1r=",
    "BAR": "123qsdsdbdq0e4y34tfsfgsdfbsdgsdg23r423r3="
  },
  "qa": {
    "FOO": "vsdfgkertrktertpekt235023rqdfm124=",
    "BAR": "asf1242rtfdgnvhjr5y745ytfdfsdfwq23rewdfa="
  }
}
```

The `envcrypt` runner will combine the values in `secrets.json` and `config.json` for the given environment, and stick the key/value pairs into `process.env` for your application to pull from.