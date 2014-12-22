
define(function (require, exports, module) {
    "use strict";

	var AppInit             = brackets.getModule("utils/AppInit"),
		CommandManager		= brackets.getModule("command/CommandManager"),
		Dialogs             = brackets.getModule("widgets/Dialogs"),
		ProjectManager      = brackets.getModule("project/ProjectManager"),
		FileSystem          = brackets.getModule("filesystem/FileSystem"),
		FileUtils           = brackets.getModule("file/FileUtils"),
		ExtensionUtils      = brackets.getModule("utils/ExtensionUtils");
		
	var tasks = [];
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
		
		// Render the dialog
		Dialogs.showModalDialogUsingTemplate(Mustache.render(dialog), false);
		
		// Load all tasks from file
		loadTasks();
		
		// Get the dialog instance
		var $dialogInstance = $(".task-list-dialog.instance");	
		
		// Add click EventListener
		$dialogInstance.find(".dialog-button[data-button-id='cancel']").on("click", handleCancel);
		$dialogInstance.find(".dialog-button[data-button-id='ok']").on("click", handleOk);
		
		// Adds a new task to the list
        $dialogInstance.find(".task-add").on("click", function() {
			addTask();
        });
	}
	
	function handleOk() {
		saveTasks();		
		closeDialog();
	}
	
	function handleCancel() {
		closeDialog();
	}
	
	function closeDialog() {
		Dialogs.cancelModalDialogIfOpen("task-list-dialog");
	}
	
	function addTask() {
	
		var $dialogInstance = $(".task-list-dialog.instance");
		if(! $dialogInstance.find('.items .new').find('input[type=text]').val()) return;
		
		tasks.unshift({
			'description': $dialogInstance.find('.items .new').find('input[type=text]').val(),
			'completed': 0
		});
		
		var $newRow = $dialogInstance.find('.items .clone').clone();
		$dialogInstance.find('.items .new').removeClass('new');
		$newRow.insertAfter($('.items tr.clone')).removeClass('clone').addClass('new').show();		
	}
	
	function loadTasks() {
	
		var projectRoot = ProjectManager.getProjectRoot().fullPath;
		FileSystem.resolve(projectRoot + "tasks.json", function (err, fileContent) {
			if (!err) {
				FileUtils.readAsText(fileContent).done(function (text) {
					tasks = $.parseJSON(text);
					
					if(tasks.length){
						var $dialogInstance = $(".task-list-dialog.instance");
						
						$.each(tasks, function(index, value){
							var $newRow = $dialogInstance.find('.items .clone').clone();
							
							$newRow.find('input[type=text]').val(value.description);
							$newRow.find('input[type=text]').prop('disabled', value.completed);
							$newRow.find('input[type=checkbox]').prop('checked', value.completed);
							$newRow.insertBefore($dialogInstance.find('tr.addRow')).removeClass('clone');
						});
					}
				});
			}
		});
	}
	
	function saveTasks() {
	
		var projectRoot = ProjectManager.getProjectRoot().fullPath;
		var file = FileSystem.getFileForPath(projectRoot + 'tasks.json');
		FileUtils.writeText(file, JSON.stringify(tasks));
  }
});