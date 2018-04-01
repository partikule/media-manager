<template>

	<modal :title="getTitle"
		   :ok-text="trans('mediamanager.confirmation.delete.label')"
		   :width="520"
		   :is-show="show"
		   :on-ok="deleteItem"
		   :on-cancel="close"
	>

		<div slot="body">

			<ul>
				<li v-for="item in getItems" class="media">
					<div class="media-left">
						<figure class="image is-64x64">
							<img v-if="isImage(item)"
								 :src="item.webPath"
							/>
							<div v-else>
								<i class="fa" :class="isFolder(item) ? 'fa-folder-o' : 'fa-file-text-o'"></i>
							</div>
						</figure>
					</div>
					<div class="media-content">

						<div class="file-description-field">
							<strong :title="item.name">{{ item.name }}</strong>
						</div>

						<div v-if="item.size" class="file-description-field">
							<span>{{ item.size | humanFileSize }}</span>
						</div>

						<div v-if="!isFolder(item)" class="file-description-field">
							<span>
								<a :href="item.webPath"
								   target="_blank"
								   rel="noopener"
								   :title="trans('mediamanager.button.file_url.title')"
								>{{ trans('mediamanager.button.file_url.label') }}</a>
							</span>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</modal>
</template>

<script>

	import Modal from '../../modal';
	import mixins from '../mixins/file-manager-mixin';

	export default{
		components: {
			Modal
		},
		mixins: [mixins],
		props:{
			currentFile:{},
			currentFiles:{
				type: Array,
				default: function(){
					return []
				}
			},
			show:{
				default : false
			}
		},
		computed: {
			getTitle()
			{
				return this.hasCurrentFiles ? this.trans('mediamanager.confirmation.delete_multiple') : this.trans('mediamanager.confirmation.delete');
			},
			getMessage()
			{
				return this.currentFiles.length > 1 ? this.trans('mediamanager.confirmation.delete_multiple') :
					this.trans('mediamanager.confirmation.delete');
			},
			getItems()
			{
				return this.hasCurrentFiles ? this.currentFiles : (this.currentFile ? [this.currentFile] : []);
			}
		},
		mounted() {
			document.addEventListener("keydown", this.deleteItemFromKey);
		},
		beforeDestroy() {
			document.removeEventListener("keydown", this.deleteItemFromKey)
		},
		methods: {
			close(){
				this.$emit('close');
			},
			deleteItem(){
				this.$emit('delete');
			},
			deleteItemFromKey(e){
				if (this.show && e.keyCode === 13) {
					this.deleteItem();
				}
			}
		}
	}
</script>