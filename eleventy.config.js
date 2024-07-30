import markdownItAnchor from "markdown-it-anchor";

import { InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
// import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginFilters from "./_config/filters.js";

import embedSpotify from "eleventy-plugin-embed-spotify";
import embedSoundCloud from "eleventy-plugin-embed-soundcloud";
import embedEverything from "eleventy-plugin-embed-everything";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function(eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig
		.addPassthroughCopy({
			"./public/": "/",
			"./node_modules/prismjs/themes/prism-okaidia.css": "/css/prism-okaidia.css"
		})
		.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
	// Adds the {% css %} paired shortcode
	eleventyConfig.addBundle("css");
	// Do you want a {% js %} bundle shortcode too?
	// eleventyConfig.addBundle("js");

	// Official plugins
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
	eleventyConfig.addNunjucksFilter("limit", (arr, limit) => arr.slice(0, limit));
// Media plugins - creativitas.dev - https://fiverr.com/creativitas

// soundcloud here..

eleventyConfig.addPlugin(embedSoundCloud, {
auto_play: false, // @Boolean: be cool, don’t do this!
  color: '#ff7700', // @String: hex code to control the color scheme
  embedClass: 'eleventy-plugin-embed-soundcloud', // @String: class name of wrapper div
  height: 400, // @Int/@String: height of the embedded iframe.
  // ☝️ Use Integer for pixels; Use String for percent value
  sharing: true, // @Boolean: show sharing button
  show_artwork: true, // @Boolean: show the track/playlist cover art
  show_comments: true, // @Boolean: show listener comments
  show_playcount: true, // @Boolean: show total number of plays
  show_reposts: false, // @Boolean: show total number of reposts
  show_user: true, // @Boolean: show the uploading user’s name above the track/set name
  small: false, // @Boolean: Convenience setting: Use smaller waveform embed style
  // ☝️ small: true overrides `visual` to `false` and `height` to `166`.
  single_active: true, // @Boolean: only one player active on a page at a time. 
  // ☝️ single_active behavior seems buggy right now, your mileage may vary
  visual: true, // @Boolean: Default SoundCloud player style shows a huge cover image.
  width: '100%' // @Int/@String: width of the embedded iframe
});

// usage just copy and paste the url link in to markdown post - https://soundcloud.com/megan-thee-stallion/sets/suga


// spotify goes here...

eleventyConfig.addPlugin(embedSpotify);

// spotify usage on markwodn just copy and paste the url link
// example spotify
// https://open.spotify.com/track/7nJZ9LplJ3ZAyhQyJCJk0K
// https://open.spotify.com/album/2PjlaxlMunGOUvcRzlTbtE
// https://open.spotify.com/artist/6ueGR6SWhUJfvEhqkvMsVs
// https://open.spotify.com/episode/7G5O2wWmch1ciYDPZS4a4O


// Embed Everything - Embeded for tiktok, instagram and youtube can use this plugins

eleventyConfig.addPlugin(embedEverything);


	// Atom Feed
	eleventyConfig.addPlugin(feedPlugin, {
		outputPath: "/feed/feed.xml",
		stylesheet: "pretty-atom-feed.xsl",
		templateData: {
			eleventyNavigation: {
				key: "Feed",
				order: 3
			}
		},
		collection: {
			name: "posts",
			limit: 10,
		},
		collection: {
			name: "musics",
			limit: 10,
		},
		collection: {
			name: "projects",
			limit: 10,
		},
		metadata: {
			language: "en",
			title: "Brendan's Portfolio Website",
			subtitle: "Update from fullstackbrendan website app",
			base: "https://fullstackbrendan.dev/",
			author: {
				name: "FULLSTACKBRENDANDEV"
			}
		}
	});

	// Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
	// Not work on CMS
//	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
//		// File extensions to process in _site folder
//		extensions: "html",
//
//		// Output formats for each image.
//		formats: ["avif", "webp", "auto"],
//
//		// widths: ["auto"],
//
//		defaultAttributes: {
//			// e.g. <img loading decoding> assigned on the HTML tag will override these values.
//			loading: "lazy",
//			decoding: "async",
//		}
//	});

	// Filters
	eleventyConfig.addPlugin(pluginFilters);

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary("md", mdLib => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1,2,3,4],
			slugify: eleventyConfig.getFilter("slugify")
		});
	});

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
};

export const config = {
	// Control which files Eleventy will process
	// e.g.: *.md, *.njk, *.html, *.liquid
	templateFormats: [
		"md",
		"njk",
		"html",
		"liquid",
		"11ty.js",
	],

	// Pre-process *.md files with: (default: `liquid`)
	markdownTemplateEngine: "njk",

	// Pre-process *.html files with: (default: `liquid`)
	htmlTemplateEngine: "njk",

	// These are all optional:
	dir: {
		input: "content",          // default: "."
		includes: "../_includes",  // default: "_includes" (`input` relative)
		data: "../_data",          // default: "_data" (`input` relative)
		output: "_site"
	},

	// -----------------------------------------------------------------
	// Optional items:
	// -----------------------------------------------------------------

	// If your site deploys to a subdirectory, change `pathPrefix`.
	// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

	// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
	// it will transform any absolute URLs in your HTML to include this
	// folder name and does **not** affect where things go in the output folder.

	// pathPrefix: "/",
};
