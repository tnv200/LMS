package com.torryharris.BackEndSample.Service.Tag;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.torryharris.BackEndSample.Entity.Tag;
import com.torryharris.BackEndSample.Repository.TagRepository;

@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagRepository tagRepository;

    @Override
    public List<Tag> getAllTags() {
        return (List<Tag>) tagRepository.findAll();
    }

    @Override
    public Tag getTagById(Integer tagId) {
        return tagRepository.findById(tagId).get();
    }

    @Override
    public void addTag(Tag tag) {
        tagRepository.save(tag);
    }

    @Override
    public void deleteTagById(Integer tagId) {
        tagRepository.deleteById(tagId);
    }

    @Override
    public void updateTag(Integer tagId, Tag updatedTag) {
    
    	 Tag existingTag = tagRepository.findById(tagId).orElse(null);

         if (existingTag != null) {
             // Update the properties you want to change
             existingTag.setTagname(updatedTag.getTagname());

             // Save the updated tag
             tagRepository.save(existingTag);
    
    }

        
    }
    
}
