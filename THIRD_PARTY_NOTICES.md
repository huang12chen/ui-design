# Third-party notices

The current example sites ship no third-party code, fonts, photographs or bundled libraries. They have no npm dependencies and download no runtime assets. Their visuals are original CSS, inline SVG or text; the current screenshots in the documentation were captured from those examples. The portfolio's asset register is `examples/alex-lin/dist/ASSETS.md`.

Type is set in operating-system fallback stacks. Naming a family such as `'Noto Serif SC'` inside a CSS `font-family` list asks the browser to use it when the reader's own machine already has it installed; no font file is copied, subset or redistributed here, so no font licence obligation attaches to this repository.

## Historical recordings

The retained recordings under `docs/media/` show an earlier version of the fictional example. The source photographs are no longer bundled as separate files, but may be visible in those recordings. They remain subject to the [Unsplash License](https://unsplash.com/license), not this project's MIT license:

- Elijah Pilchard, [A desk with a laptop and a lamp on it](https://unsplash.com/photos/a-desk-with-a-laptop-and-a-lamp-on-it-C51WQ7xqsAE).
- Kelli McClintock, [Brown cardboard box](https://unsplash.com/photos/brown-cardboard-box-DcoB_NoNl6U).

The earlier site also rendered a subset of [Noto Serif SC](https://github.com/notofonts/noto-cjk), distributed under the SIL Open Font License 1.1. No font file is included in the current site. The recordings are illustrative and do not depict a real person's workplace or client work.

## Earlier releases

Versions up to and including 1.2.0 did carry three third-party items in the example site:

- Motion 14.6.0 (`vendor/`), MIT, with its licence file.
- A 10,908-byte subset of Noto Serif SC 500 (`assets/fonts/`), SIL Open Font License 1.1, with its `OFL.txt`.
- Two stock photographs (`assets/photos/`), used illustratively under their own Unsplash terms.

All three were removed when the case visuals became CSS drawings and the motion layer became the browser's own scroll-driven animations. If you are holding a 1.2.0 or earlier archive, the terms above applied to that archive; they do not apply to the current tree, which no longer contains those files.

Interface drawings, synthetic datasets and fictional case copy in this project are original teaching materials under the root MIT licence. No real brand endorsement or employment history is asserted.
