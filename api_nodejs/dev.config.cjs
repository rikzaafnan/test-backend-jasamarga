module.exports = {
	apps : [{
		name            : "be-test",
		script: "src/index.js",
		ignore_watch: ['logs'],
		watch           : true,
		increment_var   : 'PORT',
        log_date_format	: "YYYY-MM-DD HH:mm Z",
        merge_logs		: true,
        instances		: 1,
        exec_mode		: "cluster",
		// env             : {
		// 	"NODE_OPTIONS"  : "--max-old-space-size=2048 --max-new-space-size=2048",
		// 	"NODE_ENV"      : "development",
		// 	// "NODE_PORT":9494
		// }
	}]
}
