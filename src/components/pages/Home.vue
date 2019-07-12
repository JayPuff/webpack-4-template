<!-- Template -->
<template>
    <div class="home">
        <h2> {{ message }} </h2>
        <p> Running in <span :class="$store.state.context.dev ? 'blue' : 'purple'"> {{ $store.state.context.dev ? 'Development' : 'Production'}} </span> mode</p>
        <p> Running in <span :class="$store.state.context.electron ? 'blue' : 'green'"> {{ $store.state.context.electron ? 'Electron' : 'Browser'}} </span></p>
        <p> Current CSS Breakpoint: <span class="purple">{{ $store.state.context.breakpoint.name }}</span></p>
        <p> Mobile or tablet: <span :class="lessThan('m') ? 'blue' : 'green'"> {{ lessThan(`m`) ? 'Yes' : 'Nope'}} </span></p>
        <p> {{ $store.state.context.config ? `Static JSON Config: ${JSON.stringify($store.state.context.config)}` : 'No Static JSON Config.' }} </p>
        <p> {{ $store.state.context.electronConfig ? `electron JSON Config: ${JSON.stringify($store.state.context.electronConfig)}` : 'No Electron JSON Config.' }} </p>
    </div>
</template>


<!-- Script -->
<script>

import { mapGetters } from 'vuex'
export default {
    components: {  }, 
    data: () => {
        return {
            message: "Nick's Vue Project Template" + `something`
        }
    },

    computed: {  
        ...mapGetters('context', [ 'lessThanOrEquals', 'lessThan', 'equals', 'greaterThan', 'greaterThanOrEquals' ]),
    }
};
</script>



<!-- Style -->
<style lang="scss" scoped>
@import "Styles/mixins.scss";
@import "Styles/globals.scss";

#hello {
    text-align: red;
}

.home {
    text-align: center;
    width: 100%;
    height: 100vh; 
    font-size: 17px;
    @include flex(column, center, center, nowrap);

    h2 {
        margin-bottom: 10px;
    }

    .blue {
        color: rgb(54, 116, 197);
        font-weight: bold;
    }

    .purple {
        color: rgb(125, 50, 196);
        font-weight: bold;
    }

    .green {
        color: rgb(35, 158, 101);
        font-weight: bold;
    }
}
</style>
