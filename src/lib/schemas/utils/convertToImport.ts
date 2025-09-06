export class FileNameAdapter {
  static convertTitleToFilename(
    title: string,
    extension: 'interface' | 'enum' | 'type' = 'interface',
    noTs: boolean = false,
  ) {
    const nameTitle = title.split('');
    nameTitle[0] = nameTitle[0].toLowerCase();
    return `${nameTitle.join('')}.${extension}${noTs ? '' : '.ts'}`;
  }

  static convertRefToImport(
    ref: string,
    variants: 'enums' | 'interface' | 'type' = 'interface',
  ) {
    const title = ref.split('/').pop() as string;
    switch (variants) {
      case 'enums':
        return `./enums/${FileNameAdapter.convertTitleToFilename(
          title,
          'enum',
          true,
        )}`;
      default:
        return `./${FileNameAdapter.convertTitleToFilename(
          title,
          'interface',
          true,
        )}`;
    }
  }
}
