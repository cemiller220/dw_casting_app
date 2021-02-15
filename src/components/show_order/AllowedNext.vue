<template>
    <h2>Allowed Next</h2>
    <div class="row">
        <div class="col-auto" v-for="(allowedPieces, pieceName) in allowedNext" :key="pieceName">
            <div>
                <input type="checkbox"  :value="pieceName" :id="pieceName" v-model="selectedPieces">
                <label :for="pieceName" :class="currentShowOrder.includes(pieceName) ? 'inShowOrder' : 'missing'">&nbsp; {{ pieceName }}</label>
            </div>
        </div>
    </div>

    <div class="row" v-for="(allowedPieces, pieceName) in filteredAllowedNext" :key="pieceName">
        <h5>{{ pieceName }}</h5>
        <div class="row">
            <div class="col-auto optionBadges" v-for="piece in allowedPieces" :key="piece">
                <base-badge :title="piece" :clickable="false"></base-badge>
            </div>
        </div>
        <br/>
        <br/>
        <hr/>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import BaseBadge from "../UI/BaseBadge";

    export default {
        name: "AllowedNext",
        components: {BaseBadge},
        data() {
            return {
                selectedPieces: []
            }
        },
        computed: {
            ...mapGetters('show_order', ['allowedNext', 'currentShowOrder']),
            filteredAllowedNext() {
                return Object.keys(this.allowedNext)
                    .filter(piece => this.selectedPieces.includes(piece))
                    .reduce((obj, key) => {
                        obj[key] = this.allowedNext[key];
                        return obj;
                    }, {});
            }
        }
    }
</script>

<style scoped>
    .inShowOrder {
        color: black;
    }

    .missing {
        color: red;
    }

    .optionBadges {
        margin: 0.5rem 0;
    }
</style>
