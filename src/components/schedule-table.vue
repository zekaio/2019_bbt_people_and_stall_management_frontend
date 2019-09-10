<script>
export default {
  props: ["scheduleList", "cellHeight"],
  data() {
    return {};
  },
  methods: {
    weekMap(index) {
      return [
        "节次",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ][index + 1];
    },
    unionSchedule(data) {
      for (let i = 0; i < 7; i++)
        for (let j = 0; j < 11; j++) {
          let lessonShouldWeeks = data[i][j];
          let preRange;
          for (let z = 0; z < lessonShouldWeeks.length; z++) {
            let range = lessonShouldWeeks[z].split("-");
            if (z === 0) {
              preRange = range;
              continue;
            }
            if (+preRange[preRange.length - 1] === +range[0] - 1) {
              // 当仅有一个元素
              if (preRange.length === 1) preRange.push(+range[0]);
              else preRange[1] = +range[0];
              if (range.length === 2) preRange[1] = range[1];
              lessonShouldWeeks.splice(
                z - 1,
                2,
                `${preRange[0]}-${preRange[1]}`
              );
            } else preRange = range;
          }
        }
      return data;
    }
  },
  computed: {
    scheduleTableData() {
      let table = [];
      for (let i = 0; i < 7; i++) {
        let singleDay = [];
        for (let j = 0; j < 11; j++) singleDay.push([]);
        table.push(singleDay);
      }
      let originData = this.scheduleList.sort((left, right) => {
        if (+left.weekday > +right.weekday) return 1;
        if (+left.beginWeek > +right.beginWeek) return 1;
        // it dose't  nessasary should
        if (+left.beginLesson > +right.beginLesson) return 1;
        return 0;
      });
      for (let single of originData) {
        let currentDay = +single.weekday - 1;
        if (single._temporary) continue;
        for (
          let lesson = +single.beginLesson;
          lesson <= +single.endLesson;
          lesson++
        ) {
          if (single.beginWeek === single.endWeek)
            table[currentDay][+lesson - 1].push(single.beginWeek);
          else
            table[currentDay][+lesson - 1].push(
              `${single.beginWeek}-${single.endWeek}`
            );
        }
      }
      return this.unionSchedule(table);
    }
  },
  render(h) {
    const days = [-1, 0, 1, 2, 3, 4, 5, 6];
    const lessions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const CELL_HEIGHT = this.cellHeight;

    let data = this.scheduleTableData;
    // 这里面的col为表格中的col，当对应的是 scheduleTableData的row
    let body = days.map(col => {
      let header = (
        <div class="col__header" style={{ height: CELL_HEIGHT + "px" }}>
          {this.weekMap(col)}
        </div>
      );
      let colCells = lessions.map(row => {
        if (col === -1)
          return (
            <div
              style={{ height: CELL_HEIGHT + "px" }}
              class="col__content"
            >{`第${row + 1}节`}</div>
          );
        let current = data[col][row].join(",").trim();
        let hasFormatError = false 
        for(let i = 1; i < data[col][row].length; i ++)
          if(+data[col][row][i].split("-")[0] <= +data[col][row][i-1].split("-").splice(-1)[0]){
            hasFormatError = true; break;
        }
        let next = row + 1 <= 10 ? data[col][row + 1].join(",").trim() : "";
        if (current === next && row !== 10 && current !== "") return null;
        let count = 0;
        let preRowIndex = row - 1;
        while (
          preRowIndex >= 0 &&
          data[col][preRowIndex].join(",").trim() === current &&
          current !== ""
        )
          preRowIndex--;
        let cellCount = row - preRowIndex;
        let className =
          "col__content " + (!!current ? "col__content_unavailable " : "") + (hasFormatError ? "col__content_format_error": "");
        return (
          <div
            style={{
              height: cellCount * CELL_HEIGHT + cellCount - 1 + "px"
            }}
            class={className}
          >
            {!!current ? `第 ${current} 周` : ""}
          </div>
        );
      });
      return (
        <div class="col">
          {header}
          {colCells}
        </div>
      );
    });
    return <el-row id="table">{body}</el-row>;
  }
};
</script>

<style scoped>
#table {
  display: flex;
  width: 90%;
}
.col__content_unavailable {
  background: #909399;
  color: white;
}
.col {
  flex: 1;
  color: rgb(144, 147, 153);
  font-weight: 500;
}
.col > div {
  border: 0.5px solid #ebeef5;
  border-left: 0.5px solid transparent;
  border-top: 0.5px solid transparent;
  padding: 0 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.col > div:first-child {
  border-top: 0.5px solid #ebeef5 !important;
}
.col:first-child > div {
  border-left: 0.5px solid #ebeef5 !important;
}
.col__content_format_error{
  background: #F56C6C;
}
</style>