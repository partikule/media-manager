import Vue from 'vue';

import FileManagerMixin from './mixins/file-manager-mixin';

import MediaModal from './components/MediaModal.vue';
import MediaCreateFolderModal from './components/CreateFolderModal.vue';
import MediaDeleteItemModal from './components/ConfirmDeleteModal.vue';
import MediaErrors from './components/Errors.vue';
import MediaMoveItemModal from './components/MoveItemModal.vue';
import MediaRenameItemModal from './components/RenameItemModal.vue';
import MediaManager from './components/MediaManager.vue';

const install = () => {

	Vue.mixin(FileManagerMixin);

	Vue.component('MediaModal', MediaModal);
	Vue.component('MediaCreateFolderModal', MediaCreateFolderModal);
	Vue.component('MediaDeleteItemModal', MediaDeleteItemModal);
	Vue.component('MediaErrors', MediaErrors);
	Vue.component('MediaMoveItemModal', MediaMoveItemModal);
	Vue.component('MediaRenameItemModal', MediaRenameItemModal);
	Vue.component('MediaManager', MediaManager);
};

install();

export default { install };


