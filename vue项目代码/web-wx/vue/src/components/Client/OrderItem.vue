<template>
	<div class="order_item" @click="jumpDetail(data.orderSn)">
    <template v-if="type">
      <template v-if="type==1">
        <div class="row first-row">
          <div :class="'status status'+data.orderStatus">
            {{data.orderStatusName||data.orderStatusStr ||data.orderStatusStr}}
          </div>
          <span>
            发货方：{{data.sendOrgName || data.sendName}}
          </span>
        </div>
        <div class="row" v-if="data.sendOrgCode">
          <span>
            客户编码：{{data.sendOrgCode}}
          </span>
        </div>
      </template>
      <template v-else>
        <div class="row first-row">
          <div :class="'status status'+data.orderStatus">
            {{data.orderStatusName||data.orderStatusStr ||data.orderStatusStr}}
          </div>
          <span>
            收货方：{{data.receOrgName||data.receName}}
          </span>
        </div>
        <div class="row" v-if="data.receOrgCode">
          <span>
            客户编码：{{data.receOrgCode}}
          </span>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="row first-row">
        <div :class="'status status'+data.orderStatus">
          {{data.orderStatusName||data.orderStatusStr ||data.orderStatusStr}}
        </div>
          <span>
          收货方：{{data.receOrgName||data.receName}}
        </span>
      </div>
      <div class="row" v-if="!type">
			  <span>
				  发货方：{{data.sendOrgName||data.sendName}}
        </span>
      </div>
    </template>
		<div class="row second-row">
			<div class="count">
				共{{data.goodsCount||data.goodsTotalCnt||data.goodsCnt||0}}件商品
			</div>
			{{data.orderSn}}
		</div>
		<div class="row" v-if="data.collectionMoney">
			代收货款：<span class="red">¥&nbsp;{{data.collectionMoney>0?data.collectionMoney:0 ||data.shouldReceivedMoney?data.shouldReceivedMoney:0}}.00</span>
		</div>
		<div class="row" v-if="data.orderStatus!=10||(type==2 && data.carriageTotalMoney>=0)||!type">
			运费：¥&nbsp;{{data.carriageTotalMoney>0?data.carriageTotalMoney:0||data.totalFreight?data.totalFreight:0}}.00<span v-if="data.carriagePayTypeStr">&nbsp;&nbsp;&nbsp;({{data.carriagePayTypeStr}})</span>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'OrderItem',
		props: ['data', 'type'],
		components: {},
		data() {
			return {}
		},
		methods: {
			jumpDetail(sn) {
				this.$emit('jumpDetail', sn);
			}
		}
	}
</script>
