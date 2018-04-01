<template>

	<modal :title="getTitle"
		   :ok-text="trans('mediamanager.button.rename.label')"
		   :width="520"
		   :is-show="show"
		   :on-active="active"
		   :on-ok="rename"
		   :on-cancel="close"
	>

		<div slot="body">

			<div v-if="currentFile" class="media">
				<div class="media-left">
					<figure class="image is-64x64">
						<img v-if="isImage(currentFile)"
							 :src="currentFile.webPath"
						/>
						<div v-else>
							<i class="fa" :class="isFolder(currentFile) ? 'fa-folder-o' : 'fa-file-text-o'"></i>
						</div>
					</figure>
				</div>
				<div class="media-content">

					<div class="field has-addons">
						<div class="control is-expanded">

							<input v-validate="'required'"
								   name="name"
								   :class="{'is-danger': errors.has('name') }"
								   type="text"
								   class="input"
								   v-model="newItemName"
								   @keyup.enter="rename"
							>

							<span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>

						</div>
						<div class="control" v-if="! isFolder(currentFile)">
							<a class="button">
								<span>.{{ getItemExtension(currentFile) }}</span>
							</a>
						</div>
					</div>
				</div>
			</div>
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
			show:{
				default : false
			}
		},
		computed: {
			getTitle()
			{
				return this.trans('mediamanager.button.rename.label');
			}
		},
		data(){
			return {
				newItemName: null
			}
		},
		watch: {
			currentFile: function (obj) {
				if ( ! obj) return;
				this.newItemName = this.getItemNameWithoutExtension(obj);
			}
		},
		methods: {
			active()
			{
				this.$emit('active');
				this.focusOnInput();
			},
			close()
			{
				this.$emit('close');
			},
			focusOnInput()
			{
				let el = this.$el.querySelector('.input');
				setTimeout(function(){
					el.focus()
				}, 100);
			},
			rename()
			{
				this.$validator.validateAll().then(result => {

					if (result)
					{
						this.$emit('rename', this.newItemName);
					}
				});
			}
		}
	}
</script>
