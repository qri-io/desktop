# Troubleshooting

There are lots of pitfalls & issues with e2e testing. Here's how to slay some of them dragons.

## Error: ChromeDriver did not start within 5000ms
If you see this message & no e2e tests running at all, you need to do a total rebuild of your npm modules:

```
yarn install --force
```

More:
https://github.com/electron-userland/spectron/issues/144