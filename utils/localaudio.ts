export const getlocalAudioURI = (item: any) => {
    return item && item.id && `/assets/?unstable_path=.%2Fassets%2Faudio%2F${item?.id.includes('w') ? 'words' : 'lines'}/` + `${item?.id}.mp3`
}