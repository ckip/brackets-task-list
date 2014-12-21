
define(function (require, exports, module) {
    "use strict";

	var AppInit             = brackets.getModule("utils/AppInit"),
		CommandManager		= brackets.getModule("command/CommandManager"),
		Dialogs             = brackets.getModule("widgets/Dialogs"),
		ExtensionUtils      = brackets.getModule("utils/ExtensionUtils");
		
	var dialog		= require("text!htmlContent/dialog.html");
	var toolbar		= require("text!htmlContent/toolbar.html");
	
	AppInit.appReady(function () {
	
		ExtensionUtils.loadStyleSheet(module, "styles/main.css");
		
		// Append the task list icon to the right toolbar
		$("#main-toolbar .buttons").append(toolbar);
		
		// Add click EventListener
		$("#task-list-toolbar").on("click", function() {
			showDialog();
		});
	});
	
	function showDialog() {
	
		Dialogs.showModalDialogUsingTemplate(Mustache.render(dialog), false);
		
		var $dialogInstance = $(".task-list-dialog.instance");
		$dialogInstance.find(".dialog-button[data-button-id='ok']").on("click", handleOk);
	}
	
	function handleOk() {
		Dialogs.cancelModalDialogIfOpen("task-list-dialog");
	}
});