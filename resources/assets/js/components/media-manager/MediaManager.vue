<template>
	<transition name="modal">

		<div class="media-manager" :class="(inModal) ? 'modal-mode' : ''">

			<div class="media-manager-toolbar" :class="(inModal) ? 'modal-mode' : ''">

				<!--
					Toolbar's Buttons
				-->
				<div class="field is-grouped" role="toolbar">

					<div class="buttons has-addons control">

						<!-- Upload -->
						<label class="button is-success"
							   :title="trans('mediamanager.button.upload.title')"
						>
							<span class="icon is-small">
								<i class="fa fa-upload"></i>
							</span>
							<span class="hidden-xs">{{ trans('mediamanager.button.upload.label') }}</span>
							<input type="file" class="is-hidden" @change="uploadFile($event.target.name, $event.target.files)" name="files[]"/>
						</label>

						<!-- Add Folder -->
						<a class="button"
						   :title="trans('mediamanager.button.add_folder.title')"
						   @click="showCreateFolder"
						>
							<span class="icon is-small">
								<i class="fa fa-folder"></i>
							</span>
							<span class="hidden-xs">{{ trans('mediamanager.button.add_folder.label') }}</span>
						</a>

						<!-- Refresh -->
						<a class="button"
						   :title="trans('mediamanager.button.refresh.title')"
						   @click.prevent="refresh"
						>
							<span class="icon is-small">
								<i class="fa fa-refresh"></i>
							</span>
							<span class="hidden-xs">{{ trans('mediamanager.button.refresh.label') }}</span>
						</a>


					</div>

					<div class="buttons has-addons control">

						<!-- Move -->
						<button class="button"
								:disabled="!isMoveEnabled"
								@click.prevent="showMoveItem"
								:title="trans('mediamanager.button.move.label')"
						>
							<span class="icon is-small">
								<i class="fa fa-arrow-right"></i>
							</span>
							<span class="hidden-xs">{{ trans('mediamanager.button.move.label') }}</span>
						</button>

						<!-- Rename -->
						<button class="button"
								:disabled="!isRenameEnabled"
								:title="trans('mediamanager.button.rename.title')"
								@click="showRenameItem"
						>
							<span class="icon is-small">
								<i class="fa fa-edit"></i>
							</span>
							<span class="hidden-xs">{{ trans('mediamanager.button.rename.label') }}</span>
						</button>

						<!-- Delete -->
						<button v-if=" ! inModal"
								:disabled="!isDeleteEnabled"
								:title="trans('mediamanager.button.delete.title')"
								class="button is-danger"
								@click="showDeleteItem"
						>
							<span class="icon is-small">
								<i class="fa fa-trash"></i>
							</span>
							<span class="hidden-xs">{{ trans('mediamanager.button.delete.label') }}</span>
						</button>

						<button-confirm v-if="inModal"
										icon="trash"
										icon_confirm="trash"
										:title="trans('core.delete')"
										:label="trans('core.delete')"
										:label_confirm="trans('core.sure')"
										:onClick="deleteItem"
										:disable="!isDeleteEnabled"
						/>

					</div>
				</div>
			</div>

			<div class="media-manager-controls">

				<!--
					Beadcrumb
				-->
				<nav class="breadcrumb" :class="(inModal) ? 'modal-mode' : ''" aria-label="breadcrumbs">
					<ul>
						<li v-for="(name, key) in breadCrumbs">
							<a @click=loadFolder(key)>{{ name }}</a>
						</li>

						<li class="is-active">
							<a>{{ folderName }}</a>
						</li>
					</ul>
				</nav>


				<!--
					Action Toolbar
				-->
				<media-manager-create-folder-toolbar :show="showCreateFolderToolbar"
													 :prefix="prefix"
													 @create="createFolder"
													 @close="hideCreateFolder"
				/>

				<media-manager-move-toolbar :show="showMoveItemToolbar"
											:current-file="currentFile"
											:all-directories="allDirectories"
											@open="getAllDirectories"
											@move="moveItem"
											@close="hideMoveItem"
				/>

				<media-manager-rename-toolbar :show="showRenameItemToolbar"
											  :current-file="currentFile"
											  @rename="renameItem"
											  @close="hideRenameItem"
				/>

			</div>

			<div class="dropzone" id="mediaManagerDropZone">

				<div v-if="isUploading" class="alternative-content loading">

					<p>
						<span class="button icon is-loading is-text"></span>
						{{uploadFileName}} : {{ uploadProgress }} %
					</p>

					<progress v-if="isUploading"
							  class="progress is-success"
							  :value="uploadProgress"
							  max="100"
					>{{ uploadProgress }} %</progress>

				</div>

				<div class="file-browser">

					<div v-if="isFolderEmpty" class="file-browser-empty-folder">
						<h4>{{ trans('mediamanager.text.empty_folder') }}</h4>
						<p>
							{{ trans('mediamanager.text.drag_n_drop') }}
						</p>
					</div>

					<div v-else class="columns">

						<transition name="files">
							<div class="column">

								<div class="table-responsive file-picker-list">

									<table class="table is-hoverable is-narrow has-no-border"
										   tabindex="-1"
										   @focus="enableKeyboardEvents"
										   @focusout="disableKeyboardEvents"
									>
										<thead>
										<tr>
											<th>
												<a @click="orderBy('name')">
														<span class="icon sort" v-if="orderedBy('name')">
															<i :class="'fa fa-caret-' + orderDirectionIcon"></i>
														</span>
													{{ trans('mediamanager.label.name') }}
												</a>
											</th>
											<th class="has-text-right">
												<a @click="orderBy('size')">
														<span class="icon sort" v-if="orderedBy('size')">
															<i :class="'fa fa-caret-' + orderDirectionIcon"></i>
														</span>
													{{ trans('mediamanager.label.size') }}
												</a>
											</th>

											<!--
											<th>
												<a @click="orderBy('mimeType')">
														<span class="icon sort" v-if="orderedBy('mimeType')">
															<i :class="'fa fa-caret-' + orderDirectionIcon"></i>
														</span>
													{{ trans('mediamanager.label.type') }}
												</a>
											</th>
											-->
											<th class="has-text-centered">
												<a @click="orderBy('modified.date')">
														<span class="icon sort" v-if="orderedBy('modified.date')">
															<i :class="'fa fa-caret-' + orderDirectionIcon"></i>
														</span>
													{{ trans('mediamanager.label.date') }}
												</a>
											</th>
										</tr>
										</thead>
										<tbody>
										<tr v-for="(folder, path) in folders"
											:class="[ isSelected(folder) ? 'is-selected' : '' ]"
											:data-id="folder.fullPath"
											@click.exact="previewFile(folder)"
											@click.meta.exact="addToSelection(folder)"
											@click.shift.exact="addMultipleToSelection(folder)"
											@dblclick="loadFolder(folder.fullPath)"
										>
											<td>
												<span class="icon">
													<i class="fa fa-folder"></i>
												</span>
												<span
													class="word-wrappable">
													{{ folder.name }}
												</span>
											</td>
											<td></td>
											<td class="has-text-centered">{{ folder.modified.date | formatDate('DD/MM/YYYY') }}</td>
										</tr>

										<tr v-for="file in files"
											:class="[ isSelected(file) ? 'is-selected' : '' ]"
											:data-id="file.fullPath"
											@click.exact="previewFile(file)"
											@click.meta.exact="addToSelection(file)"
											@click.shift.exact="addMultipleToSelection(file)"
											@dblclick="chooseCurrentItem"
										>
											<td>
												<span class="icon">
													<i v-if="isImage(file)" class="fa fa-image"></i>
													<i v-else class="fa fa-file-text-o"></i>
												</span>
												<span
													class="word-wrappable">
													{{ file.name }}
												</span>

											</td>
											<td class="has-text-right"> {{ file.size | humanFileSize }}</td>
											<td class="has-text-centered"> {{ file.modified.date | formatDate(dateFormat) }}</td>
										</tr>
										</tbody>
									</table>
								</div>
							</div>
						</transition>
						<!--
						Preview
						-->
						<transition name="preview">
						<div v-if="currentFile && !isFolder(currentFile)" class="file-picker-sidebar column is-one-third">

							<img v-if="isImage(currentFile)"
								 class="img-responsive center-block"
								 id="preview-image"
								 :src="currentFile.webPath"
								 style="width: 100%"
							/>

							<div v-else class="media-manager-no-preview">

								<i class="fa fa-file-text-o"></i>

							</div>

							<div class="file-description">

								<div class="file-description-field">
									<span class="label">{{ trans('mediamanager.label.name') }}</span>
									<span :title="currentFile.name">{{ currentFile.name }}</span>
								</div>

								<div class="file-description-field">
									<span class="label">{{ trans('mediamanager.label.size') }}</span>
									<span>{{ currentFile.size | humanFileSize }}</span>
								</div>

								<div class="file-description-field">
									<span class="label">{{ trans('mediamanager.label.url') }}</span>
									<span>
										<a :href="currentFile.webPath"
										   target="_blank"
											rel="noopener"
										   :title="trans('mediamanager.button.file_url.title')"
									>{{ trans('mediamanager.label.url') }}</a></span>
								</div>

								<div class="file-description-field">
									<span class="label">{{ trans('mediamanager.label.uploaded_on') }}</span>
									<span>{{ currentFile.modified.date | formatDate(dateFormat) }}</span>
								</div>

							</div>
						</div>
						</transition>

					</div>
				</div>
			</div>

			<!-- Modals -->
			<media-manager-delete-modal :show="showDeleteItemModal"
										:current-file="currentFile"
										:current-files="currentFiles"
										@delete="deleteItem"
										@close="hideDeleteItem"
			/>

			<media-manager-create-folder-modal :show="showCreateFolderModal"
											   @create="createFolder"
											   @close="hideCreateFolder"
			/>

			<media-manager-move-modal :show="showMoveItemModal"
									  :current-file="currentFile"
									  :current-files="currentFiles"
									  :all-directories="allDirectories"
									  @open="getAllDirectories"
									  @move="moveItem"
									  @close="hideMoveItem"
			/>

			<media-manager-rename-modal :show="showRenameItemModal"
									  	:current-file="currentFile"
										@rename="renameItem"
									  	@close="hideRenameItem"
			/>

		</div>
	</transition>
</template>

<script>

	import axios from 'axios'
	import Dropzone from 'dropzone';
	import moment from 'moment';

	import mixins from './mixins/file-manager-mixin';

	import MediaManagerCreateFolderModal from "./modal/MediaManagerCreateFolderModal";
	import MediaManagerMoveModal from "./modal/MediaManagerMoveModal";
	import MediaManagerRenameModal from "./modal/MediaManagerRenameModal";
	import MediaManagerDeleteModal from "./modal/MediaManagerDeleteModal";

    import MediaManagerCreateFolderToolbar from "./toolbar/MediaManagerCreateFolderToolbar";
    import MediaManagerMoveToolbar from "./toolbar/MediaManagerMoveToolbar";
    import MediaManagerRenameToolbar from "./toolbar/MediaManagerRenameToolbar";

    import ButtonConfirm from '../button-confirm/ButtonConfirm';

	Dropzone.autoDiscover = false;

	let token = document.head.querySelector('meta[name="csrf-token"]');

	if (token) {
		axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
	} else{
		console.error('Media-Manager : CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
	}

	export default {

		mixins: [mixins],

		components: {
			ButtonConfirm,

			MediaManagerCreateFolderModal,
			MediaManagerMoveModal,
			MediaManagerRenameModal,
			MediaManagerDeleteModal,

            MediaManagerCreateFolderToolbar,
            MediaManagerMoveToolbar,
            MediaManagerRenameToolbar
		},

        props: {
            /**
             * If the media-manager is in one modal,
             * displays the action toolbar instead of modals for actions
             * Also displays the "select file" button
             */
            inModal: {
                default: false
            },

			/**
			 * Linked with inModal
			 * The parent component should put this to false if the modal
			 * is not visible, to prevent DOM events linked events to be catched
			 */
			isVisible: {
            	default: true
			},

            /**
             * Default route prefix
             */
            prefix: {
                default : '/admin/'
            },

            /**
             * The event to be fired when selectItem() is called.
             * The actual event name emitted is prefixed w/
             * "media-manager-selected-" so to avoid
             * clashes w/ other events.
             */
            selectedEventName: {
                default: false
            },

            /**
             * If this instance is a modal window then this
             * property is used to show or hide the
             * modal window.
             */
            show: {
                default: false
            },

			/**
			 * If set, events like  delete, move, rename
			 * will be emaitted on this eventHub, with the
			 * corresponding event name.
			 */
			eventHub: {
            	default: null
			},

			/**
			 * EventHub events names.
			 * Some are set by default, prefixed by 'mediamanager'
			 * to avoid collisions.
			 */
			eventHubEvents: {
				type: Object,
				default: function () {
					return {
						delete: 'mediamanager.delete',
						move: 'mediamanager.move',
						rename: 'mediamanager.rename',
						create_folder: 'mediamanager.create_folder',
					}
				}
			},

			/**
			 * Notification Component
			 * If set, will be used for notification
			 * and Delete confirmation from modal
			 *
			 */
			notifyComponent: {
				default: null
			},

			dateFormat: {
            	type: String,
				default: 'DD/MM/YYYY'
			},

			/**
			 * User's HTTP instance.
			 * By default, one new axiosaxios instance will be created
			 *
			 */
			http: {
				type: Function,
				default: null
			},
		},

		filters: {
			// @todo: Do that without moment.
			formatDate(date, format)
			{
				if (!date) return null;
				if (!format) format = 'DD/MM/YYYY LTS';
				return moment(date).utc().format(format)
			},
		},

		computed:{
			isFolderEmpty(){
				return ((this.files.length + this.folders.length ) === 0);
			},
			orderDirectionIcon(){
				return this.sortDirection ? 'down' : 'up';
			},
			getHttp(){
				return this.http || axios;
			},
			isRenameEnabled(){
				return (this.currentFiles.length < 2 && this.currentFile && this.currentFile.name !== '..');
			},
			isDeleteEnabled(){
				return (this.currentFile && this.currentFile.name !== '..');
			},
			isMoveEnabled(){
				return (this.currentFile && this.currentFile.name !== '..');
			},

		},

        data: function () {

            return {

                /**
                 * breadCrumbs for the current path that are used to go
                 * backwards through the directory tree.
                 */
                breadCrumbs: {},

                /**
                 * The currently highlighted file
                 */
                currentFile: null,

				currentFiles: [],

                /**
                 * The current path that the media manager is displaying
                 */
                currentPath: null,

				currentUpFolder: null,

                /**
                 * All of the files in the current path
                 */
                files: [],

                /**
                 * The current path's folder name
                 */
                folderName: null,

                /**
                 * All of the sub folders in the current path
                 */
                folders: [],

				/**
				 *  All items (folder + files)
				 *  Set to be able to move with the keybord
				 *  withing the items list
				 */
				filesAndFolders: [],

				/**
				 * All Directories
				 * Used by Move Item components
				 */
				allDirectories: {},

				/**
				 * Property to show the upload progression informations
				 */
				isUploading: false,

                /**
                 * Property to show upload progress
                 */
                uploadProgress: 0,

				uploadFileName: '',

                /**
                 * Total files and folder count
                 */
                itemsCount: 0,

                /**
                 * properties to show and hide internal modal windows
                 */
                showCreateFolderToolbar: false,
                showMoveItemToolbar: false,
                showRenameItemToolbar: false,

                showCreateFolderModal: false,
                showMoveItemModal: false,
                showRenameItemModal: false,
				showDeleteItemModal: false,

                /**
				 * property to hold direction of column sorting
                 */
                sortDirection: false,

				/**
				 * Column on which the sort is currently active
				 */
				sortColumn: null,

				item: null,

                totalUploadProgresses: [],

            }
        },

        mounted() {

			this.loadFolder();
            this.dragUpload();

            if( ! this.prefix.endsWith('/') )
			{
			    this.prefix = `${this.prefix}/`;
			}
		},

        methods: {

			/**
			 * Emit the array of selected objects, even only one file is selected
			 * Filters on files only (no folders can be choose)
			 * Returns an empty array if no items or only folders are selected
			 */
			chooseCurrentItem()
			{
				let items = this.hasCurrentFiles ? this.currentFiles.filter(item => ! this.isFolder(item)) :
					( ! this.isFolder(this.currentFile) ? [this.currentFile] : [] );

				this.$emit('choose', items);
			},

			showCreateFolder()
			{
			    this.hideAllActions();
				this.inModal ? this.showCreateFolderToolbar = true : this.showCreateFolderModal = true;
			},

			showMoveItem()
			{
			    this.hideAllActions();
				this.inModal ? this.showMoveItemToolbar = true : this.showMoveItemModal = true;
			},

			showRenameItem()
			{
                this.hideAllActions();
                this.inModal ? this.showRenameItemToolbar = true : this.showRenameItemModal = true;
			},

			showDeleteItem()
			{
                this.hideAllActions();
				this.inModal ? this.hideAllActions() : this.showDeleteItemModal = true;
			},

			hideCreateFolder()
			{
				this.showCreateFolderModal = this.showCreateFolderToolbar = false;
			},

			hideMoveItem()
			{
				this.showMoveItemModal = this.showMoveItemToolbar = false;
			},

			hideRenameItem()
			{
                this.showRenameItemModal = this.showRenameItemToolbar = false;
			},

			hideDeleteItem()
			{
                this.showDeleteItemModal = this.showDeleteItemToolbar = false;
			},

			hideAllActions()
			{
				this.hideCreateFolder();
				this.hideMoveItem();
				this.hideRenameItem();
				this.hideDeleteItem();
			},

            /**
			 * sort files and folders...
             * @param column
             */
            orderBy(column)
			{
				if (column !== this.sortColumn)
					this.sortDirection = false;
				else
					this.sortDirection = !this.sortDirection;

				this.sortColumn = column;
			    const order = (this.sortDirection)? 'desc' : 'asc';
				this.files = _.orderBy(this.files, [column], [order]);
				this.folders = _.orderBy(this.folders, [column], [order]);

				if (this.currentUpFolder && this.folders.indexOf(this.currentUpFolder) > -1)
				{
					this.folders.splice(this.folders.indexOf(this.currentUpFolder), 1);
					this.folders.unshift(this.currentUpFolder)
				}

				this.filesAndFolders = this.folders.concat(this.files);
			},

			orderedBy(column){
				return (this.sortColumn === column);
			},

			refresh() {
				this.loadFolder(this.currentPath);
				this.isLoading = false;
			},

            loadFolder(path)
			{
                this.uploadProgress = 0;

                if (!path)
                    path = ( this.currentPath ) ? this.currentPath : '';
                else
					this.setCurrentItemLoading(true, path);

                this.currentFile = null;

				this.hideAllActions();

                this.getHttp.get(`${this.prefix}browser/index?path=${path}`).then(
                    (response) => {
						this.breadCrumbs = response.data.breadCrumbs;
                        this.currentFile = null;
                        this.currentPath = response.data.folder;
                        this.files = response.data.files;
                        this.folderName = response.data.folderName;
                        this.folders = response.data.subFolders;
                        this.itemsCount = response.data.itemsCount;

                        this.currentUpFolder = null;

                        if (path !== '' && path !== '/')
						{
							path = path.substring(0, path.lastIndexOf("/"));
							if (path === '') path = '/';

							this.currentUpFolder = {
								fullPath: path,
								mimeType: 'folder',
								name: '..',
								modified: {date: '1970-01-01'}
							};

							this.folders.unshift(this.currentUpFolder);
						}

                        this.filesAndFolders = response.data.subFolders.concat(response.data.files);

                        this.sortColumn = null;

						this.removeItemsLoading();
					},
                    (response) => {
                        if (response.data.error) {
                            this.emitNotification(response.data.error, 'error');
                        }
                        this.currentFile = null;
                    }
                );
            },

			previewFile(file){

                this.currentFile = file;
				this.currentFiles = [];
            },

			addToSelection(file) {

            	if (this.currentFiles.length === 0) this.currentFiles.push(this.currentFile);

            	if ( this.currentFiles.indexOf(file) === -1)
            	{
					this.currentFile = file;
					this.currentFiles.push(file);
				}
            	else
            	{
					this.currentFiles.splice(this.currentFiles.indexOf(file), 1);
					this.currentFile = null;
				}
			},

			addMultipleToSelection(file) {

            	if (this.currentFiles.length === 0) this.currentFiles.push(this.currentFile);

            	let targetIdx = this.filesAndFolders.indexOf(file),
					startIdx = this.filesAndFolders.indexOf(this.currentFiles[0]),
					direction = targetIdx > startIdx ? 1 : -1;

				this.currentFiles = [];

				while((startIdx) !== targetIdx+direction)
				{
					this.currentFiles.push(this.filesAndFolders[startIdx]);
					startIdx += direction;
				}
			},

			isSelected(file)
			{
				return (this.currentFiles.indexOf(file) > -1 || this.currentFile === file) || false;
			},

            uploadFile(fieldName, fileList){

                /**
                 * Create a new form request object.
                 * Gather all of the files to be uploaded and append them to it.
                 * Attach the current path so the server knows where to upload the files to.
                 * Send a post request to the server...
                 */
                const form = new FormData();
                Array
                    .from(Array(fileList.length).keys())
                    .map(x => {
                        form.append(fieldName, fileList[x], fileList[x].name);
                    });
                
                form.append('folder', this.currentPath);

                this.isUploading = true;
                this.getHttp.post(`${this.prefix}browser/file`, form, {
						progress(e){
							if (e.lengthComputable) {
                                this.uploadProgress = parseFloat( Math.round(e.loaded / e.total * 100) ).toFixed(2);
							}
						}
                    }
                ).then(
                    (response) => {
                        this.emitNotification(response.data.success);
                        this.loadFolder(this.currentPath);
                        this.isUploading = false;
                    },
                    (response) => {
                        const error = (response.data.error) ? response.data.error : response.statusText;
                        // when uploading we might have some files uploaded and others fail
                        if (response.data.notices) this.emitNotification(response.data.notices);
                        this.emitNotification(error, 'danger');
                        this.loadFolder(this.currentPath);
                        this.isUploading = false;
                    }
                );

            },

            dragUpload(){

            	new Dropzone(
					this.$el.querySelector('.dropzone'),
					{
						clickable: false,
						createImageThumbnails: false,
						dictDefaultMessage: '',
						parallelUploads: 1,
						autoProcessQueue: true,
						paramName: "files",
						previewTemplate: '<span class="hidden"></span>',

						// @todo: Implement chunk to be able to upload really big files.
						// See : https://github.com/pionl/laravel-chunk-upload to implement it.
						// chunking: true,
						// chunkSize: 512,

						hiddenInputContainer: true,
						uploadMultiple: true,
						url: `${this.prefix}browser/file`,
						headers: {
							"X-CSRF-TOKEN": this.getHttp.defaults.headers.common['X-CSRF-TOKEN']
						},

						sending: (file, xhr, form) => {
							form.append('folder', this.currentPath);
							this.isUploading = true;
						},

						success:(files, response) => {
							this.loadFolder(this.currentPath);
						},

						error:(file, errorMessage, xhr) => {

							if (xhr.statusText)
								this.emitNotification(file.name + ': ' + xhr.statusText, 'error');
						},

						uploadprogress: (file, progress, bytesSent) => {

							let percent = (bytesSent / file.size * 100).toFixed(0);

							this.uploadFileName = file.name;
							this.uploadProgress = percent;
						},

						queuecomplete: () => {
							this.emitNotification(this.trans('mediamanager.text.upload_finished'), 'success');
							this.isUploading = false;
						}
					}
				)
            },

			removeItemsLoading()
			{
				let els = this.$el.querySelectorAll('.file-browser tr .icon');
				for (let i = 0; i < els.length; i++) {
					els[i].classList.remove('button', 'is-loading', 'is-text');
				}
			},

			setCurrentItemLoading(on)
			{
				if (this.currentFile) {
					let itemIcon = this.$el.querySelector('.file-browser tr[data-id="' + this.currentFile.fullPath + '"] .icon');
					if (itemIcon)
					{
						if (on){
                            if(this.currentFile.fullPath === arguments[1])
                            	itemIcon.classList.add('button', 'is-loading', 'is-text');
						}

						else
							itemIcon.classList.remove('button', 'is-loading', 'is-text');
					}
				}
				else
				{
					if (typeof(arguments[1]) !== 'undefined')
					{
						this.currentFile = {fullPath:arguments[1]};
						this.setCurrentItemLoading(on);
					}
				}
			},

			deleteItem()
			{
				if (this.currentFiles.length > 1)
				{
					let self = this;

					this.currentFiles.forEach(function (item)
					{
						self.byeByeItem(item);
					});
				}
				else
				{
					// Display one nice loading icon on the item going to be delete
					this.setCurrentItemLoading(true);

					this.byeByeItem(this.currentFile);
				}
			},

			canBeDeleted(item)
			{
				return item.name !== '..';
			},

			confirmBeforeDelete()
			{
				// To be sure Enter / ESC does not fire.
				this.disableKeyboardEvents();

				this.emitConfirmation({
					title: this.trans('mediamanager.confirmation.sure'),
					content: this.trans('mediamanager.confirmation.delete_multiple'),
					onAccept: this.deleteItem,
					onClose: this.enableKeyboardEvents
				});
			},

			byeByeItem(item)
			{
				item = item || this.currentFile;

				if (this.canBeDeleted(item))
				{
					let route = this.isFolder(item) ? `${this.prefix}browser/folder` : `${this.prefix}browser/file`;

					this.getHttp.delete(route, {params: {path: item.fullPath}}).then(response => {
						let currentIdx = this.currentFiles.length < 2 ? this.filesAndFolders.indexOf(item) : 0;
						this.setCurrentItemLoading(false);
						this.removeItemFromData(item);
						this.selectNextItem(currentIdx);
						this.currentFile = null;
						if (this.currentFiles.length === 0)
							this.emitNotification(response.data.success);
						this.hideDeleteItem();

						if (this.eventHub)
							this.eventHub.$emit(this.eventHubEvents.delete, item);

					})
					.catch(error => {
						this.setCurrentItemLoading(false);
						this.emitNotification(error.response.data.error, 'error');
					});
				}
			},

			moveItem(newFolderLocation)
			{
				if (this.currentFiles.length > 1)
				{
					let self = this;

					this.currentFiles.forEach(function (item)
					{
						self.reallyMoveItem(item, newFolderLocation);
					});
				}
				else
				{
					this.reallyMoveItem(this.currentFile, newFolderLocation);
				}
			},

			reallyMoveItem(item, newFolderLocation)
			{
				let data = {
					'path': this.currentPath,
					'currentItem': this.getItemName(item),
					'newPath': newFolderLocation,
					'type': (this.isFolder(item)) ? 'Folder' : 'File'
				};

				this.getHttp.post(`${this.prefix}browser/move`, data).then(response => {
					this.removeItemFromData(item);
					this.hideMoveItem();

					if (this.currentFiles.length === 0)
						this.emitNotification(response.data.success);

					if (this.eventHub)
						this.eventHub.$emit(this.eventHubEvents.move, data);
				})
				.catch(error => {
					this.emitNotification(error.response.data.error, 'error');
				});
			},

			renameItem(newItemName){

				let data = {
					'path': this.currentPath,
					'original': this.getItemName(this.currentFile),
					'newName': newItemName + ( ! this.isFolder(this.currentFile) ? '.' + this.getItemExtension(this.currentFile) : ''),
					'type': (this.isFolder(this.currentFile)) ? 'Folder' : 'File'
				};

				this.getHttp.post(`${this.prefix}browser/rename`, data).then(response => {
					this.emitNotification(response.data.success);
					this.loadFolder();
					this.hideRenameItem();
					if (this.eventHub)
						this.eventHub.$emit(this.eventHubEvents.rename, data);

				})
				.catch(error => {
					this.emitNotification(error.response.data.error, 'error');
				});
			},

			createFolder(newFolderName){

				let data = {
					'folder': this.currentPath,
					'new_folder': newFolderName
				};

				this.getHttp.post(`${this.prefix}browser/folder`, data).then(response => {
					this.emitNotification(response.data.success);
					this.loadFolder();
					this.hideCreateFolder();
					if (this.eventHub)
						this.eventHub.$emit(this.eventHubEvents.create_folder, data);
				})
				.catch(error => {
					this.emitNotification(error.response.data.error, 'error');
				});
			},

			getAllDirectories(){
				this.getHttp.get(`${this.prefix}browser/directories`).then(response => {
					this.newFolderLocation = this.currentPath;
					this.allDirectories = response.data;
				})
					.catch(error => {
						let message = error.response.data.error ? error.response.data.error : error.response.statusText;
						this.$emit('error', message, 'error');
					});
			},

			removeItemFromData(item)
			{
				this.filesAndFolders.splice(this.filesAndFolders.indexOf(item), 1);
				this.currentFiles.splice(this.currentFiles.indexOf(item), 1);

				if (this.isFolder(item))
					this.folders.splice(this.folders.indexOf(item), 1);
				else
					this.files.splice(this.files.indexOf(item), 1);
			},

			selectNextItem(idx)
			{
				if (idx > 0)
					this.currentFile = this.filesAndFolders[idx] ?
						this.filesAndFolders[idx] : (
							this.filesAndFolders[idx -1] ? this.filesAndFolders[idx -1] : null
						);
			},

			emitNotification(notices, type='success', params={}) {

            	let self = this;

            	if (typeof notices === 'object') {
					notices.forEach(function(notice) {
						self.$emit('notification', notice, type)
					});
					return;
				}

				this.$emit('notification', notices, type);
			},

			/**
			 *
			 * @param params	Notification parameters
			 * 			{
			 * 				title: 'Are you sure?'
			 * 				content: 'Delete these items?'
			 * 				onAccept: function()			// This method must be called to execute the callback.
			 * 				onClose: function()				// This method should be called when the notification component closes.
			 * 			}
			 */
			emitConfirmation(params={})
			{
				this.$emit('confirmation', params);
			},

			enableKeyboardEvents(){
				document.addEventListener("keydown", this.keyboardEvents);
			},

			disableKeyboardEvents(){
				document.removeEventListener("keydown", this.keyboardEvents);
			},

			keyboardEvents(e)
			{
				if (this.isVisible)
				{
					if (this.currentFile)
					{
						// Down
						if (e.keyCode === 40) {
							e.preventDefault();
							let next = this.filesAndFolders[this.filesAndFolders.indexOf(this.currentFile) + 1] || null;
							if (next)
							{
								if (e.shiftKey)
									this.addMultipleToSelection(next);
								else
									this.currentFiles = [];
								this.currentFile = next;
							}
						}

						// Up
						if (e.keyCode === 38) {
							e.preventDefault();
							let next = this.filesAndFolders[this.filesAndFolders.indexOf(this.currentFile) - 1] || null;
							if (next)
							{
								if (e.shiftKey)
									this.addMultipleToSelection(next);
								else
									this.currentFiles = [];
								this.currentFile = next;
							}
						}

						// Enter
						if (e.keyCode === 13 && this.isFolder(this.currentFile)) {
							e.preventDefault();
							this.loadFolder(this.currentFile.fullPath);
						}

						// Del / Backspace
						if ((e.keyCode === 8 || e.keyCode === 46) && this.currentFile.name !== '..'){
							e.preventDefault();
							this.confirmBeforeDelete();
						}
					}
					else
					{
						// Down highlights the first file
						if (e.keyCode === 40)
						{
							e.preventDefault();
							if (this.filesAndFolders[0])
								this.currentFile = this.filesAndFolders[0];
						}
					}
				}
			}
		}
    }
</script>

<style scoped="true">

	.preview-enter-active,
	.preview-leave-active {
		transition: all 250ms ease-in-out;
	}

	.preview,
	.preview-enter,
	.preview-leave-to {
		transform: translateX(100%)
	}

	.preview-leave,
	.preview-enter-to {
		transform: translateX(0)
	}

</style>