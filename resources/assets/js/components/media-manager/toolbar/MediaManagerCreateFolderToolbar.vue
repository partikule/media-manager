<template>

	<div v-show="show"
		 :on-ok="create"
		 class="media-manager-toolbar-buttons"
	>
		<div class="field is-horizontal">
			<div>
				<label class="label">
					{{ trans('mediamanager.button.create_folder.label') }}
				</label>
			</div>
			<div class="field-body">

				<div class="field is-grouped">
					<div class="control">
						<input v-validate="'required'"
							   class="input"
							   name="name"
							   type="text"
							   v-model="newFolderName"
							   :class="{'is-danger': errors.has('name') }"
							   @keyup.enter="create"
							   :placeholder="trans('mediamanager.label.folder_name')"
						>

						<span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
					</div>
					<div class="control">
						<a type="button" class="button is-primary" @click="create">
							{{ trans('mediamanager.button.create_folder.label') }}
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

	    name: 'MediaManagerCreateFolderToolbar',

		components: {

		},
		mixins: [mixins],
		props:{

			show:{
                type: Boolean,
				default : false
			},
            onOk: {
                type: Function,
                default() {},
            }
		},

		data(){
			return {
				loading: false,
				newFolderName: null
			}
		},

		methods: {
            close(){
                this.$emit('close');
            },

			create(){

				this.$validator.validateAll().then(result =>
				{
					if (result)
					{
						this.$emit('create', this.newFolderName);
					}
				});
			}
		}
	}
</script>
