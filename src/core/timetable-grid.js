(function () {
    function renderShiftViewBody({ sessionMap, sessions, isMixedCampus, showTuanBD }) {
        const { minutesToHHMM } = __HCMUS__.schedule;

        let maxCardsAcrossAll = 1;
        sessions.forEach(sess => {
            for (let d = 2; d <= 7; d++) {
                let count = (sessionMap[d][sess.key] || []).length;
                if (count > maxCardsAcrossAll) maxCardsAcrossAll = count;
            }
        });

        let uniformRowHeight = Math.max(180, maxCardsAcrossAll * 90);
        let tbodyHtml = '';

        sessions.forEach(sess => {
            tbodyHtml += `<tr style="height: ${uniformRowHeight}px;">
                <td style="border: 1px solid #CCCCCC; background: #fafafa; vertical-align: middle; padding: 8px 4px; font-size: 14px; line-height: 1.4; text-align: center;">
                    ${sess.label}<br><span style="font-weight: normal; font-size: 12px; color: #666;">${sess.timeLabel}</span>
                </td>`;
            for (let d = 2; d <= 7; d++) {
                let rawCards = sessionMap[d][sess.key] || [];
                if (rawCards.length > 0) {
                    rawCards.sort((a, b) => a.startMin - b.startMin);

                    let cardClusters = [];
                    rawCards.forEach(card => {
                        let placed = false;
                        for (let cl of cardClusters) {
                            let hasOverlap = cl.items.some(it => card.startMin < it.endMin && it.startMin < card.endMin);
                            if (hasOverlap) {
                                cl.items.push(card);
                                placed = true;
                                break;
                            }
                        }
                        if (!placed) {
                            cardClusters.push({ items: [card] });
                        }
                    });

                    let clusterHtmls = cardClusters.map(cl => {
                        if (cl.items.length === 1) {
                            let cData = cl.items[0];
                            let campusPrefix = isMixedCampus ? (cData.campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                            let periodText = `Tiết ${cData.startPeriod}-${cData.endPeriod}`;
                            let timeStr = `${minutesToHHMM(cData.startMin)}-${minutesToHHMM(cData.endMin)}`;
                            let tuanText = '';

                            let cardHtml = `
                            <div class="tkb-session-card" style="background: ${cData.palette.bg}; color: ${cData.palette.text}; vertical-align: middle; padding: 4px 3px; font-size: 13px; text-align: center; line-height: 1.25; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; margin: 2px 0; border-radius: 3px; box-sizing: border-box;">
                                <div>${cData.courseName}</div>
                                <div style="font-size: 12px; opacity: 0.95;">(${cData.className})</div>
                                <div style="color: ${cData.palette.roomText}; font-size: 11.5px; line-height: 1.15; margin-top: 1px;">${campusPrefix}${cData.room}${tuanText}</div>
                                <div style="color: ${cData.palette.text}; font-size: 11.5px; line-height: 1.15; margin-top: 1px;">${periodText} (${timeStr})</div>
                            </div>`;

                            if (cData.isHalf) {
                                let justify = cData.isBottomHalf ? 'flex-end' : 'flex-start';
                                return `<div style="height: 50%; display: flex; flex-direction: column; justify-content: ${justify}; box-sizing: border-box;">
                                    ${cardHtml.replace('style="', 'style="min-height: calc(100% - 4px); height: calc(100% - 4px); display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; ')}
                                </div>`;
                            } else {
                                return `<div style="height: 100%; display: flex; flex-direction: column; justify-content: center; box-sizing: border-box;">
                                    ${cardHtml.replace('style="', 'style="min-height: calc(100% - 4px); height: calc(100% - 4px); display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; ')}
                                </div>`;
                            }
                        } else {
                            let mainPalette = cl.items[0].palette;
                            let isSameTuan = showTuanBD && cl.items.length > 1 && cl.items.every(co => co.tuanBD && co.tuanBD === cl.items[0].tuanBD);
                            let innerRowsHtml = cl.items.map((cData, idx) => {
                                let campusPrefix = isMixedCampus ? (cData.campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                                let periodText = `Tiết ${cData.startPeriod}-${cData.endPeriod}`;
                                let timeStr = `${minutesToHHMM(cData.startMin)}-${minutesToHHMM(cData.endMin)}`;
                                let tuanText = (showTuanBD && !isSameTuan && cData.tuanBD) ? ` (Tuần BD: ${cData.tuanBD})` : '';
                                return `
                                    <div style="padding: 2px 0; line-height: 1.25;">
                                        <div>${cData.courseName}</div>
                                        <div style="font-size: 12px; opacity: 0.95;">(${cData.className})</div>
                                        <div style="color: ${cData.palette.roomText}; font-size: 11.5px; line-height: 1.15; margin-top: 1px;">${campusPrefix}${cData.room}${tuanText}</div>
                                        <div style="color: ${cData.palette.text}; font-size: 11.5px; line-height: 1.15; margin-top: 1px;">${periodText} (${timeStr})</div>
                                    </div>
                                    ${idx < cl.items.length - 1 ? `<div style="border-top: 1px solid ${mainPalette.text}; margin: 3px 6px; opacity: 0.45;"></div>` : ''}
                                `;
                            }).join('');

                            return `
                            <div class="tkb-session-card" style="background: ${mainPalette.bg}; color: ${mainPalette.text}; vertical-align: middle; padding: 4px 3px; font-size: 13px; text-align: center; line-height: 1.25; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; margin: 2px 0; border-radius: 3px; min-height: calc(100% - 4px); height: calc(100% - 4px); display: flex; flex-direction: column; justify-content: space-around; box-sizing: border-box;">
                                ${innerRowsHtml}
                            </div>`;
                        }
                    }).join('');
                    let justifyCell = 'space-between';
                    if (cardClusters.length === 1 && cardClusters[0].items.length === 1 && cardClusters[0].items[0].isHalf) {
                        justifyCell = cardClusters[0].items[0].isBottomHalf ? 'flex-end' : 'flex-start';
                    }
                    tbodyHtml += `<td style="border: 1px solid #CCCCCC; vertical-align: top; padding: 4px; height: ${uniformRowHeight}px; box-sizing: border-box;">
                        <div style="display: flex; flex-direction: column; align-items: stretch; justify-content: ${justifyCell}; height: 100%;">
                            ${clusterHtmls}
                        </div>
                    </td>`;
                } else {
                    tbodyHtml += `<td style="border: 1px solid #CCCCCC;"></td>`;
                }
            }
            tbodyHtml += `</tr>`;
        });

        return tbodyHtml;
    }

    function renderPeriodViewBody({ gridMap, maxPeriods, isMixedCampus, basePeriodHeight, showTuanBD }) {
        let occupied = {};
        for (let d = 2; d <= 7; d++) {
            occupied[d] = {};
            for (let p = 1; p <= maxPeriods; p++) {
                occupied[d][p] = false;
            }
        }

        let uniformPeriodHeight = basePeriodHeight;
        for (let d = 2; d <= 7; d++) {
            for (let pKey in gridMap[d]) {
                let items = gridMap[d][pKey];
                if (items && items.length > 0) {
                    let maxSpan = Math.max(...items.map(it => it.span));
                    let neededH = items.length === 1 ? (maxSpan * basePeriodHeight) : (items.length * 62 + 8);
                    let reqH = Math.ceil(neededH / maxSpan);
                    if (reqH > uniformPeriodHeight) {
                        uniformPeriodHeight = reqH;
                    }
                }
            }
        }

        let tbodyHtml = '';
        for (let p = 1; p <= maxPeriods; p++) {
            tbodyHtml += `<tr style="height: ${uniformPeriodHeight}px;"><td style="border: 1px solid #CCCCCC; font-weight: normal; background: #fafafa; height: ${uniformPeriodHeight}px; vertical-align: middle;">Tiết ${p}</td>`;
            for (let d = 2; d <= 7; d++) {
                if (occupied[d][p]) continue;

                let items = gridMap[d][p];
                if (items && items.length > 0) {
                    let maxSpan = Math.max(...items.map(it => it.span));
                    for (let k = p; k < p + maxSpan && k <= maxPeriods; k++) {
                        occupied[d][k] = true;
                    }

                    if (items.length === 1) {
                        let cellData = items[0];
                        let campusPrefix = isMixedCampus ? (cellData.campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                        tbodyHtml += `<td rowspan="${cellData.span}" style="border: 1px solid #CCCCCC; background: ${cellData.palette.bg}; color: ${cellData.palette.text}; vertical-align: middle; padding: 4px; font-size: 14px; text-align: center; line-height: 1.35; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; height: ${cellData.span * uniformPeriodHeight}px; box-sizing: border-box;">
                            ${cellData.courseName}<br>(${cellData.className})<br><span style="color: ${cellData.palette.roomText}; font-size: 11.5px;">${campusPrefix}${cellData.room}</span>
                        </td>`;
                    } else {
                        let textColor = items[0].palette.text;
                        let isSameTuanBD = showTuanBD && items.length > 1 && items.every(it => it.tuanBD && it.tuanBD === items[0].tuanBD);

                        let innerRowsHtml = items.map((cellData, idx) => {
                            let campusPrefix = isMixedCampus ? (cellData.campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                            let tuanText = (showTuanBD && !isSameTuanBD && cellData.tuanBD) ? ` (Tuần BD: ${cellData.tuanBD})` : '';
                            return `
                                <div style="padding: 1px 0; line-height: 1.25;">
                                    ${cellData.courseName}<br>(${cellData.className})<br><span style="color: ${cellData.palette.roomText}; font-size: 11px;">${campusPrefix}${cellData.room}${tuanText}</span>
                                </div>
                                ${idx < items.length - 1 ? `<div style="border-top: 1px solid ${textColor}; margin: 3px 6px; opacity: 0.45;"></div>` : ''}
                            `;
                        }).join('');

                        tbodyHtml += `<td rowspan="${maxSpan}" style="border: 1px solid #CCCCCC; background: ${items[0].palette.bg}; color: ${textColor}; vertical-align: middle; padding: 4px 3px; font-size: 12.5px; text-align: center; line-height: 1.25; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; height: ${maxSpan * uniformPeriodHeight}px; box-sizing: border-box;">
                            <div style="display: flex; flex-direction: column; justify-content: space-around; height: 100%; box-sizing: border-box;">
                                ${innerRowsHtml}
                            </div>
                        </td>`;
                    }
                } else {
                    tbodyHtml += `<td style="border: 1px solid #CCCCCC; height: ${uniformPeriodHeight}px;"></td>`;
                }
            }
            tbodyHtml += `</tr>`;
        }

        return tbodyHtml;
    }

    __HCMUS__.timetableGrid = {
        renderShiftViewBody,
        renderPeriodViewBody
    };
})();
