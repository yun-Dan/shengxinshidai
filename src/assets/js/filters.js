export default {
  TimestampChangeFilter(timestamp, isText = false, time = false, justY = false) {
    let date = null;
    if (timestamp) {
      if ((timestamp + '').length < 11) {
        date = new Date(timestamp * 1000)
      } else {
        date = new Date(timestamp)
      }
      const Y = date.getFullYear();
      const M = date.getMonth() + 1;
      const D = date.getDate();
      const H = date.getHours();
      const MM = date.getMinutes();
      const S = date.getSeconds();
      if (justY) {
        return `${Y}`
      } else {
        if (isText) {
          if (time) {
            return `${Y}年${(M > 9 ? M : ('0' + M))}月${(D > 9 ? D : ('0' + D))}日${(H > 9 ? H : ('0' + H))}:${(MM > 9 ? MM : ('0' + MM))}:${(S > 9 ? S : ('0' + S))}`
          } else {
            return `${Y}年${(M > 9 ? M : ('0' + M))}月${(D > 9 ? D : ('0' + D))}日`
          }
        } else {
          if (time) {
            return `${Y}-${(M > 9 ? M : ('0' + M))}-${(D > 9 ? D : ('0' + D))} ${(H > 9 ? H : ('0' + H))}:${(MM > 9 ? MM : ('0' + MM))}:${(S > 9 ? S : ('0' + S))}`
          } else {
            return `${Y}-${(M > 9 ? M : ('0' + M))}-${(D > 9 ? D : ('0' + D))}`
          }
        }
      }
    } else {
      return null
    }
  },
  idToNameFilter(id, list, idField = 'id', nameField = 'name') {
    let ITEM = list.filter(item => {
      return id === item[idField]
    });
    if (ITEM.length) {
      return ITEM[0][nameField]
    } else {
      return '（无）'
    }
  },
  TimeChangeTimeFilter(timestamp) {
    let date = null;
    if ((timestamp + '').length < 11) {
      date = new Date(timestamp * 1000)
    } else {
      date = new Date(timestamp)
    }
    const H = date.getHours();
    const MM = date.getMinutes();
    return `${(H > 9 ? H : ('0' + H))}:${(MM > 9 ? MM : ('0' + MM))}`
  },
  TimeChangeSegmentFilter(timestamp) {
    let date = null;
    if ((timestamp + '').length < 11) {
      date = new Date(timestamp * 1000)
    } else {
      date = new Date(timestamp)
    }
    const H = date.getHours();
    if (H < 12) {
      return '上午';
    } else if (H < 18) {
      return '下午';
    } else if (H < 24) {
      return '晚上';
    }
  },
}
