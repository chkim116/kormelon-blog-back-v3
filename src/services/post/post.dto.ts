import Tag from 'src/models/Tag';

export type PostOrderDto = 'like' | 'view';

export interface PostCreateParamsDto {
  /**
   * 게시글의 썸네일
   */
  thumbnail: string;
  /**
   * 게시글 제목
   */
  title: string;
  /**
   * 비밀 여부 정보
   *
   * true라면 어드민 제외 숨겨진다.
   */
  isPrivate?: boolean;
  /**
   * 게시글의 컨텐츠
   */
  content: string;
  /**
   * 카테고리 아이디
   */
  categoryId: number;
  /**
   * 서브 카테고리 아이디
   */
  subCategoryId: number;
  /**
   * 태그의 식별자 배열
   */
  tags: number[];
}

export interface PostCreateParamsEntity
  extends Omit<PostCreateParamsDto, 'tags'> {
  /**
   * 유저 아이디
   */
  userId: string;
  /**
   * 태그
   */
  tags: Tag[];
}

export interface PostUpdateParamsDto extends PostCreateParamsDto {
  /**
   * 게시글의 아이디
   */
  id: number;
}

export interface PostUpdateParamsEntity
  extends Omit<PostUpdateParamsDto, 'tags'>,
    PostCreateParamsEntity {}
