<template>
  <modals-modal v-model="show" name="queue-items" :width="800" :height="'unset'">
    <template #outer>
      <div class="absolute top-0 left-0 p-5 w-2/3 overflow-hidden">
        <p class="text-3xl text-white truncate">{{ $strings.HeaderPlayerQueue }}</p>
      </div>
    </template>
    <div ref="container" class="w-full rounded-lg bg-bg box-shadow-md overflow-y-auto overflow-x-hidden py-4" style="max-height: 80vh">
      <div v-if="show" class="w-full h-full">
        <div class="pb-4 px-4 flex items-center">
          <p class="text-base text-gray-200">{{ $strings.HeaderPlayerQueue }}</p>
          <p class="text-base text-gray-400 px-4">{{ playerQueueItems.length }} Items</p>

          <div class="grow" />
          <ui-btn class="mr-4" small color="bg-error" type="button" @click="clearQueue">Clear Queue</ui-btn>
          <ui-checkbox v-model="playerQueueAutoPlay" label="Auto Play" medium checkbox-bg="primary" border-color="gray-600" label-class="pl-2 mb-px" />
        </div>

        <draggable v-model="itemsCopy" v-bind="dragOptions" class="list-group" handle=".drag-handle" draggable=".item" tag="div" @start="drag = true" @end="drag = false" @update="draggableUpdate">
          <transition-group type="transition" :name="!drag ? 'queue-item' : null">
            <template v-for="(item, index) in itemsCopy">
              <modals-player-queue-item-row :key="index" :is-dragging="drag" :item="item" :index="index" class="item" :class="drag ? '' : 'queue-item-item'" @play="playItem(index)" @remove="removeItem" />
            </template>
          </transition-group>
        </draggable>
      </div>
    </div>
  </modals-modal>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    value: Boolean
  },
  data() {
    return {
      drag: false,
      dragOptions: {
        animation: 200,
        group: 'queue-items',
        ghostClass: 'ghost'
      },
      itemsCopy: []
    }
  },
  watch: {
    playerQueueItems: {
      handler(newVal) {
        this.init()
      }
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    playerQueueAutoPlay: {
      get() {
        return this.$store.state.playerQueueAutoPlay
      },
      set(val) {
        this.$store.commit('setPlayerQueueAutoPlay', val)
      }
    },
    playerQueueItems() {
      return this.$store.state.playerQueueItems || []
    }
  },
  methods: {
    playItem(index) {
      this.$eventBus.$emit('play-queue-item', {
        index
      })
      this.show = false
    },
    removeItem(item) {
      this.$store.commit('removeItemFromQueue', item)
    },
    clearQueue() {
      this.$store.commit('clearQueueItems')
    },
    draggableUpdate() {
      this.$store.commit(
        'setPlayerQueueItems',
        this.itemsCopy.map((item) => ({ ...item }))
      )
    },
    init() {
      this.itemsCopy = this.playerQueueItems.map((i) => ({ ...i }))
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style>
.queue-item-item {
  transition: all 0.4s ease;
}
.queue-item-enter-from,
.queue-item-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.queue-item-leave-active {
  position: absolute;
}

.ghost {
  opacity: 0.5;
  background: rgba(200, 235, 251, 0.3);
}
</style>
