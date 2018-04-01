<template>

	<modal :title="getTitle"
		   :ok-text="trans('mediamanager.button.move.label')"
		   :width="520"
		   :is-show="show"
		   :on-ok="move"
		   :on-cancel="close"
	>

		<div slot="body">

			<!-- Directory Select
			<div class="field is-horizontal">
				<div class="field-label is-normal">
					<label class="label">
						{{ trans('mediamanager.label.move_to') }}
					</label>
				</div>
				<div class="field-body">
					<div class="field">
						<div class="control is-expanded">
							<div class="select">
								<select class="form-control"
										v-model="newFolderLocation"
										id="newFolderLocation"
										name="newFolderLocation"
										@keyup.enter="move"
								>
									<option v-for="(name, path) in allDirectories"
											:value="path"
											v-html="name"></option>
								</select>
							</div>

						</div>
					</div>
				</div>
			</div>
			-->

			<div class="column">


				<div class="field is-horizontal">
					<div class="field-label is-normal">
						<label class="label">
							{{ trans('mediamanager.label.move_to') }}
						</label>
					</div>
					<div class="field-body">
						<div class="field">
							<div class="control is-expanded">
								<div class="select is-fullwidth">
									<select class="form-control"
											v-model="newFolderLocation"
											id="newFolderLocation"
											name="newFolderLocation"
											@keyup.enter="move"
									>
										<option v-for="(name, path) in allDirectories"
												:value="path"
												v-html="name"></option>
									</select>
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>



			<!--
				Items List
				Should get designed for a better rendering
			-->
			<!--
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
			-->

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
			allDirectories: {},
			show:{
				default : false
			}
		},
		computed: {
			getTitle()
			{
				return this.hasCurrentFiles ? this.trans('mediamanager.confirmation.move_multiple') : this.trans('mediamanager.confirmation.move');
			},
			getItems()
			{
				return this.hasCurrentFiles ? this.currentFiles : (this.currentFile ? [this.currentFile] : []);
			}
		},
		data(){
			return {
				newFolderLocation: null
			}
		},
		watch: {
			show(open){
				if (open) {
					this.$emit('open');
				}
			}
		},
		methods: {
			close(){
				this.newFolderName = null;
				this.$emit('close');
			},
			move(){
				this.$emit('move', this.newFolderLocation);
			}
		}
	};
</script>