# Local release packages

[简体中文](packages.zh-CN.md) · [Deployment](deploy.md) · [README](../README.en.md)

Run these commands from the repository root with Node.js 22 or newer:

```sh
npm test
npm run check
npm run release
```

No npm installation, account, Git remote, or API key is needed. On Windows the packager also uses the system PowerShell to check reparse-point attributes.

A complete release writes these local files to the ignored `release/` directory:

| File | Contents |
| --- | --- |
| `ui-design-source.zip` | The allowlisted project beneath a `ui-design/` directory: the fictional examples, source and tests, public documentation, screenshots, UI Skill, and deployment examples. |
| `ui-design-site.zip` | The portfolio example with `index.html`, `project.html`, `about.html`, cases, assets, and licenses at its top level. Suitable for a static host's ZIP upload. |
| `manifest.json` | Archive sizes and SHA-256 values, plus each archived file's size and SHA-256. |
| `SHA256SUMS.txt` | Checksums for the archives and the manifest. |

For compatibility, the packager also writes `portfolio-ui-design-source.zip` with the former `portfolio-ui-design/` top-level directory, and `portfolio-ui-design-site.zip` with the same site contents.

The packager reads the resulting ZIP bytes back and compares every file's length and SHA-256 with its source snapshot. ZIP timestamps are fixed for reproducible output. It refuses linked/reparse paths, private files in selected trees, unsupported file types, and recognizable credentials or local private paths in text. This is a targeted packaging check, not a guarantee that arbitrary material is cleared for publication.

The normal command refuses an incomplete teaching bundle: the Skill entry point, its metadata and the required screenshots must be present. For an explicitly incomplete local draft only, run `npm run release -- --allow-incomplete`. The returned manifest will say `complete: false` and list the missing material. Do not present that draft as the finished release.

Check the generated manifest and inspect the archives before uploading. Keep private originals and hosting identities outside this repository. Creating these packages does not create a GitHub repository, push commits, change a site's audience, or publish anything.

Use the [deployment guide](deploy.md) for a host you control. The site reads two ways: the card index starts at `index.html`, and one case opens on its own at `project.html?id=signal`, with `briefly` and `fieldwork` for the other two. Chinese is the same three pages pre-rendered under `zh/`, so a package that leaves that directory out publishes half a site.

The source package includes the installation/usage/community guides and the GIF/MP4 browser recordings referenced by the README. The flat site ZIP includes only the deployable website and its licenses. Both are regenerated from the current allowlist.
