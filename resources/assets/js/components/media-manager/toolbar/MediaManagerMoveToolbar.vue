<template>

	<div v-show="show"
		 :on-ok="move"
		class="media-manager-toolbar-buttons"
	>

		<div class="field is-horizontal">
			<div>
				<label class="label">
					{{ trans('mediamanager.label.move_to') }}
				</label>
			</div>
			<div class="field-body">

				<div class="field is-grouped">
					<div class="control">
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
					<div class="control">
						<a type="button" class="button is-primary" @click="move">
							{{ trans('mediamanager.button.move.label') }}
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

			allDirectories: {},

			show:{
				default : false
			}
		},
		computed: {
			getTitle()
			{
				return this.trans('mediamanager.button.move.label') + ' ' + (this.currentFile ? this.currentFile.name : '');
			},
			getHttp(){
				return this.http || axios;
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