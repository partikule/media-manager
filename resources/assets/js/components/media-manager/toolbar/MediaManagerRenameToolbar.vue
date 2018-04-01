<template>

	<div v-show="show"
		 :on-ok="rename"
		 class="media-manager-toolbar-buttons"
	>

		<div class="field is-horizontal">
			<div>
				<label class="label">
					{{ trans('mediamanager.label.rename_to') }}
				</label>
			</div>
			<div class="field-body">

				<div class="field is-grouped">

					<!--
					File name, with separated extension
					-->
					<div class="field has-addons control">

						<div class="control">
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

						<div class="control">
							<a class="button" v-if="! isFolder(currentFile)">
								<span>.{{ getItemExtension(currentFile) }}</span>
							</a>
						</div>
					</div>

					<div class="control">
						<a type="button" class="button is-primary" @click="rename">
							{{ trans('mediamanager.button.rename.label') }}
						</a>
					</div>

					<div class="control">
						<a class="delete" @click="close"></a>
					</div>

				</div>
			</div>
		</div>
	</div>

</template>

<script>
	import mixins from '../mixins/file-manager-mixin';

	export default{
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
				return this.trans('mediamanager.button.rename.label') + ' ' + (this.currentFile ? this.currentFile.name : '');
			}
		},
		watch: {
			currentFile: function (obj) {
				if ( ! obj) return;
				this.newItemName = this.getItemNameWithoutExtension(obj);
			}
		},
		data(){
			return {
				loading: false,
				newItemName: null
			}
		},
		methods: {
			close(){
				this.loading = false;
				this.$emit('close');
			},
			rename(){
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
