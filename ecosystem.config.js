module.exports =
{
	apps:
		[{
			name: 'Amer',
			script: './dist/server.js',
			autostart: true,
			error_file: "./logs/error.log",
			out_file: "./logs/access.log",
			merge_logs: true,
			exec_mode: "cluster_mode"
		}],

};
