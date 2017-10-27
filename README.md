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
# opens up $EDITOR to edit JSON file in plaintext, encrypts each value on save
$ ENVCRYPT_KEY=(key) envcrypt edit

# displays keys with decrypted values
$ ENVCRYPT_KEY=(key) envcrypt read
```

This would allow for quick management of all of the values at once, but needing to work within the JSON format.

## storage

### Option A - 2 files, one encrypted, one plain-text

This option would put `production` and `qa` in 1 file called `(config/)secrets.json`, which would have plain-text keys, and encrypted values; the other file would be `(config/)/config.json` and contains `development` and `test` with plain-text keys and values. The encrypted file would share the same encryption key between the various environments, making it easier to generate them in 1 step.

This approach would mimic the Rails 5.1 encrypted secrets pattern, where remote server secrets are stored in `secrets.yml.enc` and local configuration is in `secrets.yml`

These files would look like this internally. 

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

### Option B - a file per environment. 

This option would have a seperate config json file per environment. In this model, the default would be to drop them into a `config/` folder. For example:

- `config/production.json`
- `config/qa.json`
- `config/development.json`
- `config/test.json`

`development` and `test` environments would be marked as "insensitive" and contain their keys/values in plaintext, all other environments would be encrypted.

This model would also allow for seperate encryption keys per environment, but also allow for using the same if you're lazy :). 