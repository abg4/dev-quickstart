# Hardhat Testing Repo

## Intention

<p>This repo is intended to have scripts available to allow for testing UMA contracts with hardhat.</p>

## Get started

To start, install packages with:

```sh
$ yarn
```

Next, open another terminal in this repo and run the following command to start the hardhat blockchain instance:

```sh
yarn hardhat node --port 9545
```

Run the fixture script to set up the contracts:

```sh
HARDHAT_NETWORK=localhost ./scripts/deploy.js
```

## Scripts

Once the hardhat instance is running, run any script you want with the following format. The existing OptimisticDepositBox.js script would be run with the following command:

```sh
HARDHAT_NETWORK=localhost node ./scripts/optimisticDepositBox.js
```

This will create the transactions on your local instance. If you run it without HARDHAT_NETWORK=localhost, the script will run but not be posted to your local server.