import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter:adapter({
			out: ".dist"
		}),
		alias:{
			"@components/*": "./src/components/*",
			"$lib/*": "./src/lib/*"
		},
		env:{
			dir:'./'
		}
	}
};

export default config;
