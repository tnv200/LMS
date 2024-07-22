package com.torryharris.BackEndSample.Service.Tag;

import java.util.List;

import com.torryharris.BackEndSample.Entity.Tag;

public interface TagService {

    List<Tag> getAllTags();
    Tag getTagById(Integer tagId);
    void addTag(Tag tag);
    void deleteTagById(Integer tagId);
    void updateTag(Integer tagId, Tag updatedTag);
}
