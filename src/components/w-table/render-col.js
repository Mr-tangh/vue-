export default {
  name: 'RenderCol',
  functional: true,
  props: {
    render: Function,
    indexNum: {
      type: [String, Number],
      default: 0
    },
    dataColumn: {
      type: Object
    }
  },
  render: (h, ctx) => {
    const params = {
      row: ctx.props.dataColumn,
      index: ctx.props.indexNum
    };
    return ctx.props.render(h, params);
  }
};
