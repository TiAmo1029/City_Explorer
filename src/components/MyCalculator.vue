<template>
    <div id="calculator">
        <h1>简易加法计算器</h1>
        <div class="input-group">
            <!-- 1. 使用v-model指令将num1和num2绑定到输入框 -->
            <input v-model="num1" type="text" placeholder="请输入第一个数字" />
            <input v-model="num2" type="text" placeholder="请输入第二个数字" />
        </div>
        <!-- 2. 使用v-on:click指令绑定按钮的点击事件 -->
        <button v-on:click="handleClick">计算和</button>
        <button v-on:click="handleClick2">重置</button>
        <!-- 3. 显示计算结果 -->
        <p>计算结果: {{ sum }}</p>
        <!-- 4. 显示计算属性的结果 -->
        <p>计算属性结果: {{ result }}</p>
    </div>
</template>

<script setup>
// 1. 从vue中导入ref，它用来创建一个响应式的数据
import { ref, computed, defineProps } from 'vue';

// 1.使用defineProps()宏来声明这个组件可以接受哪些外部属性
const props = defineProps({
    title: {
        type: String,
        default: '简易加法计算器'
    },
    description: {
        type: String,
        default: '这是一个使用Vue 3和Composition API创建的简易加法计算器。'
    },
    initialNum1: {
        type: Number,
        default: 0
    },
    initialNum2: {
        type: Number,
        default: 0
    }
});

// 2. 用父组件传来的prop作为初始值来创建ref
const num1 = ref(props.initialNum1);
const num2 = ref(props.initialNum2);

// 3. 创建一个响应式的数字变量，用来存储计算结果
const sum = ref(0);
// 4. 定义一个计算属性，用来计算num1和num2的和
const result = computed(() => {
    // 如果num1或num2不是数字，返回字符串
    if (isNaN(num1.value) || isNaN(num2.value)) {
        return '请输入数字';
    }
    // 否则返回num1和num2的和
    return Number(num1.value) + Number(num2.value);
});
// 5. 定义一个函数，用来处理按钮点击事件
function handleClick() {
    // 将计算结果赋值给sum
    sum.value = result.value;
}

function handleClick2() {
    // 重置输入框和结果
    num1.value = '';
    num2.value = '';
    sum.value = 0;
    // 计算属性result会自动更新
    // 因为它依赖于num1和num2
    // 所以当num1或num2改变时，result也会自动更新
    // 这就是Vue的响应式系统
}
// 6. 在setup函数中，所有的变量和函数都可以直接使用
// 7. 注意：在Vue 3中，setup函数是一个新的组件选项，它在组件创建之前执行
// 8. 在setup函数中，我们可以使用ref和computed来创建响应式数据和计算属性
// 9. 通过v-model指令，我们可以将输入框的值与响应式数据绑定
// 10. 通过v-on:click指令，我们可以将按钮的点击事件绑定到一个函数上
// 通过{{}}语法，我们可以在模板中显示响应式数据和计算属性的值
</script>

<style scoped>
#calculator {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

input {
    width: 140px;
    padding: 10px;
    font-size: 16px;
    text-align: center;
}

.input-group {
    display: flex;
    /* 声明这个容器为flex容器 */
    flex-direction: row;
    /* 设置主轴方向为行 */
    /* 也可以使用column来设置为列 */
    /* 这样输入框会垂直排列 */
    /* 例如：flex-direction: column; */
    justify-content: center;
    /* 水平居中对齐 */
    align-items: center;
    /* 垂直居中对齐 */
    margin-bottom: 20px;
    /* 设置下边距 */
    gap: 10px;
    /* 设置输入框之间的间距 */
    /* 这里的gap属性可以让输入框之间有一定的间距 */
    /* 也可以使用margin来设置每个输入框的外边距 */
    /* 例如：input { margin-right: 10px; } */
    /* 但使用gap更简洁 */
    /* 注意：gap属性在某些旧版本的浏览器中可能不支持 */
}

button {
    margin-left: 10px;
    padding: 8px 12px;
    font-size: 16px;
    cursor: pointer;
}
</style>
